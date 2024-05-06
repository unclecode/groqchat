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
}
