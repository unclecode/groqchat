// services/models.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ChatSession } from './StorageStrategy';

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  liked: { type: Boolean, default: false },
});

const ChatSessionSchema = new Schema<ChatSession>({
  _id: { type: String, required: true },
  model: { type: String, required: true },
  messages: [MessageSchema],
});

// Check if the code is running on the client-side
const isClient = typeof window !== 'undefined';

// Define the model only on the client-side
const ChatSessionModel: Model<ChatSession> = isClient
  ? (mongoose.model.ChatSession as Model<ChatSession>) ||
    mongoose.model<ChatSession>('ChatSession', ChatSessionSchema)
  : ({} as Model<ChatSession>);

export default ChatSessionModel;