import { Schema, model, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  enrollment: Types.ObjectId;
  child?: Types.ObjectId;
  user?: Types.ObjectId;
  program: Types.ObjectId;
  phase: Types.ObjectId;
  completedLessons: {
    courseId: Types.ObjectId;
    weekIndex: number;
    lessonIndex: number;
    videoIndex: number;
    completedAt: Date;
  }[];
  percentage: number;
  lastUpdated: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true,
      index: true,
    },
    child: {
      type: Schema.Types.ObjectId,
      ref: 'Child',
      required: false,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    phase: {
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: true,
    },
    completedLessons: [
      {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
        weekIndex: { type: Number, required: true },
        lessonIndex: { type: Number, required: true },
        videoIndex: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a lesson can only be marked completed once per enrollment
ProgressSchema.index(
  { 
    enrollment: 1, 
    'completedLessons.courseId': 1, 
    'completedLessons.weekIndex': 1, 
    'completedLessons.lessonIndex': 1,
    'completedLessons.videoIndex': 1 
  },
  { unique: true, partialFilterExpression: { 'completedLessons.courseId': { $exists: true } } }
);

export const ProgressModel = model<IProgress>('Progress', ProgressSchema);
