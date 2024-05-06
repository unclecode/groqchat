// services/LocalStorageStrategy.ts
import { StorageStrategy, ChatSession } from "./StorageStrategy";

export class LocalStorageStrategy extends StorageStrategy {
    private static readonly SESSION_KEY = "groqchat-chatSession";

    async isReady(): Promise<boolean> {
        return true; // LocalStorage is always ready
    }

    async saveSession(session: ChatSession): Promise<void> {
        // Check is this the first assistant message
        if (session.messages.length === 2 && session.messages[1].role === "assistant") {
            session.caption = session.messages[1].content;
        }

        localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
    }

    async getSession(): Promise<ChatSession | null> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        return sessionJSON ? JSON.parse(sessionJSON) : null;
    }

    async getAllSessions(): Promise<ChatSession[]> {
        const sessions: ChatSession[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("groqchat-")) {
                const sessionJSON = localStorage.getItem(key);
                if (sessionJSON) {
                    sessions.push(JSON.parse(sessionJSON));
                }
            }
        }

        return sessions;
    }

    async deleteSession(): Promise<void> {
        localStorage.removeItem(LocalStorageStrategy.SESSION_KEY);
    }

    async renameSession(newCaption: string): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.caption = newCaption;
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }
}
