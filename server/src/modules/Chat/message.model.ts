import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId?: Types.ObjectId; // For Admins, Instructors, Parents
  childId?: Types.ObjectId;  // For Students
  text: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'link';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  isReadBy: Types.ObjectId[]; // Array of users who read it
  replyTo?: Types.ObjectId | any; // To store reply references
  reactions?: { emoji: string; users: Types.ObjectId[] }[]; // To store reactions
  isEdited?: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    childId: { type: Schema.Types.ObjectId, ref: 'Child' },
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file', 'audio', 'link'], default: 'text' },
    mediaUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: String },
    isReadBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
    reactions: [
      {
        emoji: { type: String },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
      }
    ],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>('Message', MessageSchema);
