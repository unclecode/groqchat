// services/StorageStrategy.ts
export interface ChatSession {
    _id: string;
    model: string;
    caption: string;
    createdAt: Date;
    messages: { role: 'user' | 'assistant'; content: string; createdAt: Date; liked?: boolean, level?: number }[];
    attachments: { sessionId: string; messageIndex: number; createdAt: Date; source: string; content: string; active: boolean }[];
}

export interface StorageInfo {
    availableStorage: number;
    usedStorage: number;
    totalStorage: number;
    // Add more properties as needed
}

export abstract class StorageStrategy {
    abstract isReady(): Promise<boolean>;
    abstract flushDB(): Promise<void>;
    abstract saveSession(session: ChatSession): Promise<void>;
    abstract getSession(sessionId: string): Promise<ChatSession | null>;
    abstract getAllSessions(): Promise<ChatSession[]>;
    abstract deleteSession(sessionId: string): Promise<void>;
    abstract renameSession(sessionId: string, newCaption: string): Promise<void>;
    abstract createThreadFromPosition(sessionId: string, position: number, editedContent: string): Promise<void>;
    abstract createAttachment(
        sessionId: string,
        messageIndex: number,
        source: string,
        content: string,
    ): Promise<void>;
    abstract getAttachments(sessionId: string): Promise<any[]>;
    abstract deleteAttachment(sessionId: string, attachmentId: number): Promise<void>;
    abstract updateAttachment(sessionId: string, attachmentId: number, active: boolean): Promise<void>;
    abstract likeMessage(sessionId: string, messageIndex: number): Promise<void>;
    abstract clearAllMessages(sessionId: string): Promise<void>;
    abstract getStorageInfo(): Promise<StorageInfo>;
}
    

 