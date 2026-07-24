import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  type: 'GROUP' | 'DIRECT' | 'PROGRAM_GROUP';
  name?: string;
  programId?: Types.ObjectId;
  batchId?: Types.ObjectId;
  scheduleId?: Types.ObjectId;
  ageGroup?: 'JUNIOR' | 'SENIOR';
  isActive: boolean;
  membersCount?: number;
  members?: any[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ['GROUP', 'DIRECT', 'PROGRAM_GROUP'], required: true },
    name: { type: String },
    programId: { type: Schema.Types.ObjectId, ref: 'Program' },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    ageGroup: { type: String, enum: ['JUNIOR', 'SENIOR'] },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for member count
ConversationSchema.virtual('membersCount', {
  ref: 'ConversationMember',
  localField: '_id',
  foreignField: 'conversationId',
  count: true
});

// Virtual for members (populated list)
ConversationSchema.virtual('members', {
  ref: 'ConversationMember',
  localField: '_id',
  foreignField: 'conversationId'
});

// Prevent multiple active group chats per batch slot and age group
ConversationSchema.index({ type: 1, batchId: 1, scheduleId: 1, ageGroup: 1 }, { unique: true, partialFilterExpression: { type: 'GROUP' } });

export const ConversationModel = model<IConversation>('Conversation', ConversationSchema);

export interface IConversationMember extends Document {
  conversationId: Types.ObjectId;
  userId?: Types.ObjectId;
  childId?: Types.ObjectId;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationMemberSchema = new Schema<IConversationMember>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    childId: { type: Schema.Types.ObjectId, ref: 'Child' },
    role: { type: String, enum: ['ADMIN', 'INSTRUCTOR', 'STUDENT'], required: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate entries for the same channel and unique user mapping
ConversationMemberSchema.index(
  { conversationId: 1, userId: 1, childId: 1 },
  { unique: true }
);

export const ConversationMemberModel = model<IConversationMember>('ConversationMember', ConversationMemberSchema);

export interface IChatSettings extends Document {
  isDirectChatEnabled: boolean;
  isGroupChatEnabled: boolean;
}

const ChatSettingsSchema = new Schema<IChatSettings>({
  isDirectChatEnabled: { type: Boolean, default: true },
  isGroupChatEnabled: { type: Boolean, default: true }
});

export const ChatSettingsModel = model<IChatSettings>('ChatSettings', ChatSettingsSchema);
