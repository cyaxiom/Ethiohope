import { Schema, model, Document, Types } from 'mongoose';

export interface IProgram {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  image?: string;
  ageRange: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    ageRange: {
      type: String,
      default: 'All ages',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ProgramModel = model<IProgram>('Program', ProgramSchema);
