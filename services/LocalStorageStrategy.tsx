// services/LocalStorageStrategy.ts
import { StorageStrategy, ChatSession } from "./StorageStrategy";

export class LocalStorageStrategy extends StorageStrategy {
    private static readonly SESSION_KEY = "groqchat-chatSession";

    async isReady(): Promise<boolean> {
        return true; // LocalStorage is always ready
    }

    async flushDB(): Promise<void> {
        localStorage.clear();
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

    async createThreadFromPosition(position: number, editedContent: string): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.messages.splice(position, 0, { role: "user", content: editedContent, createdAt: new Date() });
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }

    async createAttachment(
        messageIndex: number,
        source: string,
        content: string
    ): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.attachments.push({
                sessionId: session._id,
                messageIndex,
                createdAt: new Date(),
                source,
                content,
                active: true,
            });
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }

    async getAttachments(): Promise<any[]> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            return session.attachments;
        }

        return [];
    }

    async deleteAttachment(attachmentId: number): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.attachments.splice(attachmentId, 1);
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }

    async updateAttachment(attachmentId: number, active: boolean): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.attachments[attachmentId].active = active;
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }

    async likeMessage(messageIndex: number): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.messages[messageIndex].liked = true;
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }

    async clearAllMessages(): Promise<void> {
        const sessionJSON = localStorage.getItem(LocalStorageStrategy.SESSION_KEY);
        if (sessionJSON) {
            const session = JSON.parse(sessionJSON);
            session.messages = [];
            localStorage.setItem(LocalStorageStrategy.SESSION_KEY, JSON.stringify(session));
        }
    }
}
