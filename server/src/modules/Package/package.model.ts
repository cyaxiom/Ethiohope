import { Schema, model, Document, Types } from 'mongoose';

export interface IPackage extends Document {
  program: Types.ObjectId;
  /** Display name e.g. "3 times a week" */
  name: string;
  /** Monthly recurring price in USD */
  price: number;
  /** How many tutoring sessions per week (1–4) */
  daysPerWeek: 1 | 2 | 3 | 4 | 5;
  description?: string;
  isPopular: boolean;
  isActive: boolean;
  orderIndex: number;
  /** Optional pre-created Stripe Price id for subscriptions */
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    daysPerWeek: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    description: {
      type: String,
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    stripePriceId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

PackageSchema.index({ program: 1, daysPerWeek: 1 }, { unique: true });

export const PackageModel = model<IPackage>('TutoringPackage', PackageSchema);
