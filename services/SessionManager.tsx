// services/SessionManager.ts
import { v4 as uuidv4 } from "uuid";
import { StorageStrategy, ChatSession } from "./StorageStrategy";
import { MongoDBStorageStrategy } from "./MongoDBStorageStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { IndexedDBStorageStrategy } from "./IndexedDBStorageStrategy";
import StorageService from "./StorageService";

export class SessionManager {
    private storageStrategy: StorageStrategy;

    constructor() {
        const databaseType = StorageService.getDatabaseType();
        if (databaseType === "mongo") {
            const mongoDBConnectionString = StorageService.getMongoDBConnectionString();
            this.storageStrategy = new MongoDBStorageStrategy(mongoDBConnectionString);
        } else if (databaseType === "local") {
            this.storageStrategy = new LocalStorageStrategy();
        } else if (databaseType === "indexedDB") {
            this.storageStrategy = new IndexedDBStorageStrategy();
        }
    }

    async waitForStorageReady(): Promise<void> {
        const isReady = await this.storageStrategy.isReady();
        if (!isReady) {
            throw new Error("Storage strategy is not ready");
        }
    }

    async createSession(model: string): Promise<string> {
        await this.waitForStorageReady();
        const sessionId = uuidv4();
        const session: ChatSession = {
            _id: sessionId,
            model,
            messages: [],
        };
        await this.storageStrategy.saveSession(session);
        return sessionId;
    }

    async getSession(sessionId: string): Promise<ChatSession | null> {
        await this.waitForStorageReady();
        return this.storageStrategy.getSession(sessionId);
    }

    async updateSession(sessionId: string, message: { role: "user" | "assistant"; content: string }): Promise<void> {
        await this.waitForStorageReady();
        const session = await this.getSession(sessionId);
        if (session) {
            session.messages.push({ ...message, createdAt: new Date() });
            await this.storageStrategy.saveSession(session);
        }
    }
}
