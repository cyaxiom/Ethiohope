import { Schema, model, Document, Types } from 'mongoose';

export interface ISchedule {
  _id: Types.ObjectId;
  /** Denormalized from batch.program — schedules belong to a program. */
  program: Types.ObjectId;
  batch: Types.ObjectId;
  sessionLabel: string; // e.g. "Lecture 1", "Lecture 2", "Discussion"
  type: 'LECTURE' | 'DISCUSSION';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    program: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    sessionLabel: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['LECTURE', 'DISCUSSION'],
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      required: true,
    },
    startTime: {
      type: String, // String format like "09:00"
      required: true,
    },
    endTime: {
      type: String, // String format like "11:00"
      required: true,
    },
    capacity: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: Prevent duplicate slots for the same batch on the same day/time with the same label
ScheduleSchema.index({ batch: 1, sessionLabel: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });
ScheduleSchema.index({ program: 1, batch: 1 });

export const ScheduleModel = model<ISchedule>('Schedule', ScheduleSchema);
