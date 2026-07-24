import { Schema, model, Document, Types } from 'mongoose';

export interface IPhase {
  _id: Types.ObjectId;
  program: Types.ObjectId;
  title: string;
  description?: string;
  price?: number;
  durationWeeks?: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhaseSchema = new Schema<IPhase>(
  {
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    durationWeeks: {
      type: Number,
    },
    orderIndex: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: orderIndex must be unique per program
PhaseSchema.index({ program: 1, orderIndex: 1 }, { unique: true });

export const PhaseModel = model<IPhase>('Phase', PhaseSchema);
