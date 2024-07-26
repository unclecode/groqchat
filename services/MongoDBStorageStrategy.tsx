// @ts-nocheck
// services/MongoDBStorageStrategy.ts
import mongoose from "mongoose";
import { StorageStrategy, ChatSession } from "./StorageStrategy";
import ChatSessionSchema from "./models";

export class MongoDBStorageStrategy extends StorageStrategy {
    private connectionString: string;
    private isConnected: boolean = false;
  
    constructor(connectionString: string) {
      super();
      this.connectionString = connectionString;
    }
  
    async isReady(): Promise<boolean> {
      return this.isConnected;
    }

    async getStorageInfo(): Promise<any> {
        return {
            availableStorage: 0,
            usedStorage: 0,
            totalStorage: 0,
        };
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                debugger
                await mongoose.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                this.isConnected = true;
                console.log("Connected to MongoDB");
            } catch (error) {
                console.error("Error connecting to MongoDB:", error);
                throw error;
            }
        }
    }

    async flushDB(): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            await mongoose.connection.db.dropDatabase();
            console.log("Database flushed successfully");
        } catch (error) {
            console.error("Error flushing database:", error);
        }
    }

    async saveSession(session: ChatSession): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            // Check is this the first assistant message
            if (session.messages.length === 2 && session.messages[1].role === "assistant") {
                session.caption = session.messages[1].content;
            }

            const chatSessionModel = mongoose.model<ChatSessionModel>("ChatSession", ChatSessionSchema);
            const chatSession = new chatSessionModel(session);
            await chatSession.save();
            console.log("Session saved successfully");
        } catch (error) {
            console.error("Error saving session:", error);
        }
    }

    async getSession(sessionId: string): Promise<ChatSession | null> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            console.log("Session retrieved successfully");
            return session || null;
        } catch (error) {
            console.error("Error retrieving session:", error);
            return null;
        }
    }

    async getAllSessions(): Promise<ChatSession[]> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const sessions = await chatSessionModel.find();
            console.log("Sessions retrieved successfully");
            return sessions;
        } catch (error) {
            console.error("Error retrieving sessions:", error);
            return [];
        }
    }

    async deleteSession(sessionId: string): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            await chatSessionModel.findByIdAndDelete(sessionId);
            console.log("Session deleted successfully");
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    }


    async renameSession(sessionId: string, newCaption: string): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            await chatSessionModel.findByIdAndUpdate(sessionId, { caption: newCaption });
            console.log("Session renamed successfully");
        } catch (error) {
            console.error("Error renaming session:", error);
        }
    }

    async createThreadFromPosition(sessionId: string, position: number, editedContent: string): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.messages[position].content = editedContent;
                await session.save();
                console.log("Thread created successfully");
            }
        } catch (error) {
            console.error("Error creating thread:", error);
        }
    }

    async createAttachment(
        sessionId: string,
        messageIndex: number,
        source: string,
        content: string
    ): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.attachments.push({
                    sessionId: session._id,
                    messageIndex,
                    createdAt: new Date(),
                    source,
                    content,
                    active: true,
                });
                await session.save();
                console.log("Attachment created successfully");
            }
        } catch (error) {
            console.error("Error creating attachment:", error);
        }
    }

    async getAttachments(sessionId: string): Promise<any[]> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            console.log("Attachments retrieved successfully");
            return session?.attachments || [];
        } catch (error) {
            console.error("Error retrieving attachments:", error);
            return [];
        }
    }

    async deleteAttachment(sessionId: string, attachmentId: number): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.attachments.splice(attachmentId, 1);
                await session.save();
                console.log("Attachment deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting attachment:", error);
        }
    }

    async updateAttachment(sessionId: string, attachmentId: number, active: boolean): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.attachments[attachmentId].active = active;
                await session.save();
                console.log("Attachment updated successfully");
            }
        } catch (error) {
            console.error("Error updating attachment:", error);
        }
    }

    async likeMessage(sessionId: string, messageIndex: number): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.messages[messageIndex].liked = true;
                await session.save();
                console.log("Message liked successfully");
            }
        } catch (error) {
            console.error("Error liking message:", error);
        }
    }

    async clearAllMessages(sessionId: string): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        try {
            const chatSessionModel = this.connection.model<ChatSession>("ChatSession", ChatSessionSchema);
            const session = await chatSessionModel.findById(sessionId);
            if (session) {
                session.messages = [];
                await session.save();
                console.log("Messages cleared successfully");
            }
        } catch (error) {
            console.error("Error clearing messages:", error);
        }
    }
    
}
