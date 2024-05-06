// services/IndexedDBStorageStrategy.ts
import { StorageStrategy, ChatSession } from "./StorageStrategy";

export class IndexedDBStorageStrategy extends StorageStrategy {
    private static readonly DB_NAME = "groqchat";
    private static readonly STORE_NAME = "chat-sessions";
    private db: IDBDatabase | null = null;
    private ready: Promise<boolean>;

    constructor() {
        super();
        this.ready = this.initDB();
    }

    async isReady(): Promise<boolean> {
        return this.ready;
    }

    private async initDB(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const openRequest = window.indexedDB.open(IndexedDBStorageStrategy.DB_NAME, 1);

            openRequest.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(IndexedDBStorageStrategy.STORE_NAME)) {
                    db.createObjectStore(IndexedDBStorageStrategy.STORE_NAME, { keyPath: "_id" });
                }
            };

            openRequest.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                console.log("IndexedDB initialized successfully");
                resolve(true);
            };

            openRequest.onerror = (event) => {
                console.error("IndexedDB error:", event);
                reject(false);
            };
        });
    }

    async saveSession(session: ChatSession): Promise<void> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readwrite");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const putRequest = store.put(session);

        return new Promise<void>((resolve, reject) => {
            putRequest.onsuccess = () => {
                console.log("Session saved successfully");
                resolve();
            };

            putRequest.onerror = (event) => {
                console.error("Error saving session:", event);
                reject(event);
            };
        });
    }

    async getSession(sessionId: string): Promise<ChatSession | null> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readonly");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const getRequest = store.get(sessionId);

        return new Promise<ChatSession | null>((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const session = (event.target as IDBRequest<ChatSession>).result;
                console.log("Session retrieved successfully");
                // print the session to the console
                console.log(session);
                resolve(session || null);
            };

            getRequest.onerror = (event) => {
                console.error("Error retrieving session:", event);
                reject(event);
            };
        });
    }
}
