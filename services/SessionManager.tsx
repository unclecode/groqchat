// @ts-nocheck
// services/SessionManager.ts
import { v4 as uuidv4 } from "uuid";
import { StorageStrategy, ChatSession, StorageInfo } from "./StorageStrategy";
import { MongoDBStorageStrategy } from "./MongoDBStorageStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { IndexedDBStorageStrategy } from "./IndexedDBStorageStrategy";
import StorageService from "./StorageService";
import { AttachmentModel } from "./models";

export default class SessionManager {
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
            caption: "New session",
            messages: [],
            createdAt: new Date(),
            level: 0,
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

    async getAllSessions(): Promise<ChatSession[]> {
        await this.waitForStorageReady();
        return this.storageStrategy.getAllSessions();
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.deleteSession(sessionId);
    }

    async renameSession(sessionId: string, newCaption: string): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.renameSession(sessionId, newCaption);
    }

    async createThreadFromPosition(sessionId: string, position: number, editedContent: string): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.createThreadFromPosition(sessionId, position, editedContent);
    }

    async createAttachment(sessionId: string, messageIndex: number, source: string, content: string): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.createAttachment(sessionId, messageIndex, source, content);
    }
    
    async getAttachments(sessionId: string): Promise<any[]> {
        await this.waitForStorageReady();
        return this.storageStrategy.getAttachments(sessionId);
    }
    
    async deleteAttachment(sessionId: string, attachmentIndex: number): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.deleteAttachment(sessionId, attachmentIndex);
    }
    
    async updateAttachment(sessionId: string, attachmentIndex: number, active: boolean): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.updateAttachment(sessionId, attachmentIndex, active);
    }

    async likeMessage(sessionId: string, messageIndex: number): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.likeMessage(sessionId, messageIndex);
    }

    async clearAllMessages(sessionId: string): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.clearAllMessages(sessionId);
    }

    async flushDB(): Promise<void> {
        await this.waitForStorageReady();
        await this.storageStrategy.flushDB();
    }

    async getStorageInfo(): Promise<StorageInfo> {
        await this.waitForStorageReady();
        return this.storageStrategy.getStorageInfo();
    }
    
}
