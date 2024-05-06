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
    
}
