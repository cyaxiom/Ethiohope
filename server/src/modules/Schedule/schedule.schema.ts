import { Schema, model } from "mongoose";

const StudyScheduleSchema = new Schema(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
      index: true,
    },

    name: { type: String, default: 'Block' },

    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      required: true,
    },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

export const StudySchedule = model(
  'StudySchedule',
  StudyScheduleSchema
);
