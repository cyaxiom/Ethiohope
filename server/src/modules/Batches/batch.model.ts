import { Schema, model, Document, Types } from 'mongoose';

export interface IBatch {
  _id: Types.ObjectId;
  program: Types.ObjectId;
  instructor?: Types.ObjectId;
  capacity?: number;
  batchName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    capacity: {
      type: Number,
    },
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for schedules
BatchSchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'batch'
});

// Compound unique index: Only one batch with the same name per program
BatchSchema.index({ program: 1, batchName: 1 }, { unique: true });

export const BatchModel = model<IBatch>('Batch', BatchSchema);
