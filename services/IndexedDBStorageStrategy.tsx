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

        // Check is this the first assistant message
        if (session.messages.length === 2 && session.messages[1].role === "assistant") {
            session.caption = session.messages[1].content.substring(0, 20);
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

    async getAllSessions(): Promise<ChatSession[]> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readonly");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const getRequest = store.getAll();

        return new Promise<ChatSession[]>((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const sessions = (event.target as IDBRequest<ChatSession[]>).result;
                console.log("Sessions retrieved successfully");
                // print the sessions to the console
                console.log(sessions);
                resolve(sessions);
            };

            getRequest.onerror = (event) => {
                console.error("Error retrieving sessions:", event);
                reject(event);
            };
        });
    }

    async deleteSession(sessionId: string): Promise<void> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readwrite");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const deleteRequest = store.delete(sessionId);

        return new Promise<void>((resolve, reject) => {
            deleteRequest.onsuccess = () => {
                console.log("Session deleted successfully");
                resolve();
            };

            deleteRequest.onerror = (event) => {
                console.error("Error deleting session:", event);
                reject(event);
            };
        });
    }

    async renameSession(sessionId: string, newCaption: string): Promise<void> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readwrite");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const getRequest = store.get(sessionId);

        return new Promise<void>((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const session = (event.target as IDBRequest<ChatSession>).result;
                if (session) {
                    session.caption = newCaption;
                    const putRequest = store.put(session);

                    putRequest.onsuccess = () => {
                        console.log("Session renamed successfully");
                        resolve();
                    };

                    putRequest.onerror = (event) => {
                        console.error("Error renaming session:", event);
                        reject(event);
                    };
                } else {
                    console.error("Session not found");
                    reject(new Error("Session not found"));
                }
            };

            getRequest.onerror = (event) => {
                console.error("Error retrieving session:", event);
                reject(event);
            };
        });
    }
}
