// services/IndexedDBStorageStrategy.ts
import { StorageStrategy, ChatSession, StorageInfo } from "./StorageStrategy";

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

    async getStorageInfo(): Promise<StorageInfo> {
        try {
            const storageEstimate = await navigator.storage.estimate();
            const availableStorage = storageEstimate.quota ?? 0;
            const usedStorage = storageEstimate.usage ?? 0;
            const totalStorage = availableStorage + usedStorage;

            return {
                availableStorage,
                usedStorage,
                totalStorage,
            };
        } catch (error) {
            console.error("Error retrieving storage information:", error);
            return {
                availableStorage: 0,
                usedStorage: 0,
                totalStorage: 0,
            };
        }
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

    async flushDB(): Promise<void> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        return new Promise<void>((resolve, reject) => {
            const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readwrite");
            const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                console.log("All sessions cleared successfully");
                resolve();
            };

            clearRequest.onerror = (event) => {
                console.error("Error clearing sessions:", event);
                reject(event);
            };
        });
    }

    async saveSession(session: ChatSession): Promise<void> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        // Check if this is the first assistant message
        if (session.messages.length === 2 && session.messages[1].role === "assistant") {
            session.caption = session.messages[1].content.substring(0, 20);
        }

        // Check if the session has an attachments array, and create an empty one if it doesn't
        if (!session.attachments) {
            session.attachments = [];
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

    async createThreadFromPosition(sessionId: string, position: number, editedContent: string): Promise<void> {
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
                    session.messages[position].content = editedContent;
                    session.messages = session.messages.slice(0, position + 1);
                    const putRequest = store.put(session);

                    putRequest.onsuccess = () => {
                        console.log("Thread created successfully");
                        resolve();
                    };

                    putRequest.onerror = (event) => {
                        console.error("Error creating thread:", event);
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

    // services/IndexedDBStorageStrategy.ts

    async createAttachment(sessionId: string, messageIndex: number, source: string, content: string): Promise<void> {
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
                    const attachment = {
                        sessionId,
                        messageIndex,
                        createdAt: new Date(),
                        source,
                        content,
                        active: true,
                    };
                    session.attachments.push(attachment);
                    const putRequest = store.put(session);

                    putRequest.onsuccess = () => {
                        console.log("Attachment created successfully");
                        resolve();
                    };

                    putRequest.onerror = (event) => {
                        console.error("Error creating attachment:", event);
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

    async getAttachments(sessionId: string): Promise<any[]> {
        if (!this.db) {
            throw new Error("IndexedDB is not available");
        }

        const transaction = this.db.transaction([IndexedDBStorageStrategy.STORE_NAME], "readonly");
        const store = transaction.objectStore(IndexedDBStorageStrategy.STORE_NAME);
        const getRequest = store.get(sessionId);

        return new Promise<any[]>((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const session = (event.target as IDBRequest<ChatSession>).result;
                if (session) {
                    console.log("Attachments retrieved successfully");
                    resolve(session.attachments);
                } else {
                    console.error("Session not found");
                    resolve([]);
                }
            };

            getRequest.onerror = (event) => {
                console.error("Error retrieving attachments:", event);
                reject(event);
            };
        });
    }

    async deleteAttachment(sessionId: string, attachmentIndex: number): Promise<void> {
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
                    session.attachments.splice(attachmentIndex, 1);
                    const putRequest = store.put(session);

                    putRequest.onsuccess = () => {
                        console.log("Attachment deleted successfully");
                        resolve();
                    };

                    putRequest.onerror = (event) => {
                        console.error("Error deleting attachment:", event);
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

    async updateAttachment(sessionId: string, attachmentIndex: number, active: boolean): Promise<void> {
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
                    if (session.attachments[attachmentIndex]) {
                        session.attachments[attachmentIndex].active = active;
                        const putRequest = store.put(session);

                        putRequest.onsuccess = () => {
                            console.log("Attachment updated successfully");
                            resolve();
                        };

                        putRequest.onerror = (event) => {
                            console.error("Error updating attachment:", event);
                            reject(event);
                        };
                    } else {
                        console.error("Attachment not found");
                        reject(new Error("Attachment not found"));
                    }
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

    async clearAllMessages(sessionId: string): Promise<void> {
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
                    session.messages = [];
                    const putRequest = store.put(session);

                    putRequest.onsuccess = () => {
                        console.log("Messages cleared successfully");
                        resolve();
                    };

                    putRequest.onerror = (event) => {
                        console.error("Error clearing messages:", event);
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

    async likeMessage(sessionId: string, messageIndex: number): Promise<void> {
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
                    if (session.messages[messageIndex]) {
                        session.messages[messageIndex].liked = true;
                        const putRequest = store.put(session);

                        putRequest.onsuccess = () => {
                            console.log("Message liked successfully");
                            resolve();
                        };

                        putRequest.onerror = (event) => {
                            console.error("Error liking message:", event);
                            reject(event);
                        };
                    } else {
                        console.error("Message not found");
                        reject(new Error("Message not found"));
                    }
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
