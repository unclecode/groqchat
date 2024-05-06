// services/StorageStrategy.ts
export interface ChatSession {
    _id: string;
    model: string;
    messages: { role: 'user' | 'assistant'; content: string; createdAt: Date; liked?: boolean }[];
}

export abstract class StorageStrategy {
    abstract isReady(): Promise<boolean>;
    abstract saveSession(session: ChatSession): Promise<void>;
    abstract getSession(sessionId: string): Promise<ChatSession | null>;
}