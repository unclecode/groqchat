// @ts-nocheck
// services/models.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ChatSession } from './StorageStrategy';

export const AttachmentSchema = new Schema({
    sessionId: { type: String, required: true },
    messageIndex: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    source: { type: String, required: true },
    content: { type: String, required: true },
    active: { type: Boolean, default: true },
});

export const MessageSchema = new Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    liked: { type: Boolean, default: false },
    context: { type: String, default: '' },
});

const ChatSessionSchema = new Schema<ChatSession>({
    _id: { type: String, required: true },
    model: { type: String, required: true },
    messages: [MessageSchema],
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
});

// Check if the code is running on the client-side
const isClient = typeof window !== 'undefined';

// Define the models only on the client-side
export const ChatSessionModel: Model<ChatSession> = isClient
    ? (mongoose.model.ChatSession as Model<ChatSession>) ||
    mongoose.model<ChatSession>('ChatSession', ChatSessionSchema)
    : ({} as Model<ChatSession>);

export const AttachmentModel: Model<any> = isClient
    ? (mongoose.model.Attachment as Model<any>) ||
    mongoose.model('Attachment', AttachmentSchema)
    : ({} as Model<any>);

export default ChatSessionSchema;