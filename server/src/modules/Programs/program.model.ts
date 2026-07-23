import { Schema, model, Document, Types } from 'mongoose';

export interface IProgram {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  image?: string;
  /** Optional; primarily for kids programs. Empty/undefined = not age-gated. */
  ageRange?: string;
  /** When true, enrollment is child-only (no adult self-apply chooser). */
  isForChildren: boolean;
  /**
   * STANDARD = phases + batches (coding/courses).
   * ACADEMIC_TUTORIAL = monthly packages + 1:1 subject tutoring.
   */
  programType: 'STANDARD' | 'ACADEMIC_TUTORIAL';
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
      required: false,
      trim: true,
      default: '',
    },
    isForChildren: {
      type: Boolean,
      default: false,
      index: true,
    },
    programType: {
      type: String,
      enum: ['STANDARD', 'ACADEMIC_TUTORIAL'],
      default: 'STANDARD',
      index: true,
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
