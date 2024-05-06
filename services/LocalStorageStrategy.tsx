// services/LocalStorageStrategy.ts
import { StorageStrategy, ChatSession } from "./StorageStrategy";

export class LocalStorageStrategy extends StorageStrategy {
    private static readonly SESSION_KEY = "groqchat-chatSession";

    async isReady(): Promise<boolean> {
        return true; // LocalStorage is always ready
    }

    async saveSession(session: ChatSession): Promise<void> {
        localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
    }

    async getSession(): Promise<ChatSession | null> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        return sessionJSON ? JSON.parse(sessionJSON) : null;
    }
}
