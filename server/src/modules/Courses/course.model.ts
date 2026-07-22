import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson {
  title: string;
  description?: string;
  videoUrls: Array<string | {
    url: string;
    subtitle?: string;
    description?: string;
  }>;
  pdfUrl?: string;     // Optional PDF link
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface IExercise {
  title: string;
  questions: IQuestion[];
}

export interface IWeek {
  title: string; // week#1, week#2, etc.
  lessons: ILesson[];
  exercises: IExercise[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  program: Types.ObjectId;
  phase: Types.ObjectId;
  weeks: IWeek[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const ExerciseSchema = new Schema<IExercise>({
  title: { type: String, required: true },
  questions: [QuestionSchema]
});

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: String,
  videoUrls: [{ type: Schema.Types.Mixed }],
  pdfUrl: String
});

const WeekSchema = new Schema<IWeek>({
  title: { type: String, required: true },
  lessons: [LessonSchema],
  exercises: [ExerciseSchema]
});

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    phase: { type: Schema.Types.ObjectId, ref: 'Phase', required: true },
    weeks: [WeekSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CourseModel = model<ICourse>('Course', CourseSchema);
