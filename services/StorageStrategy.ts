// services/StorageStrategy.ts
export interface ChatSession {
    _id: string;
    model: string;
    caption: string;
    createdAt: Date;
    messages: { role: 'user' | 'assistant'; content: string; createdAt: Date; liked?: boolean }[];
}

export abstract class StorageStrategy {
    abstract isReady(): Promise<boolean>;
    abstract saveSession(session: ChatSession): Promise<void>;
    abstract getSession(sessionId: string): Promise<ChatSession | null>;
    abstract getAllSessions(): Promise<ChatSession[]>;
    abstract deleteSession(sessionId: string): Promise<void>;
    abstract renameSession(sessionId: string, newCaption: string): Promise<void>;
}