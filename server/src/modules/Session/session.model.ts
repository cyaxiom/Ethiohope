import { model, Schema, Document } from "mongoose";

export interface ISession extends Document {
  programId: Schema.Types.ObjectId;
  phaseId: Schema.Types.ObjectId;
  batchId: Schema.Types.ObjectId;
  scheduleId?: Schema.Types.ObjectId;
  sessionType: string; // 'lecture', 'qna', 'workshop', etc.
  title: string;
  description?: string;
  zoomLink?: string; // Host link (default or for one group)
  join_url?: string; // Participant link (default or for one group)
  zoomMeetingId?: string;
  
  // Junior Age Group (9-12)
  zoomLinkJunior?: string;
  joinUrlJunior?: string;
  zoomMeetingIdJunior?: string;
  
  // Senior Age Group (13-18)
  zoomLinkSenior?: string;
  joinUrlSenior?: string;
  zoomMeetingIdSenior?: string;

  startTime: Date;
  endTime: Date;
  createdBy: Schema.Types.ObjectId; // Instructor or Admin ID
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema: Schema = new Schema(
  {
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    phaseId: { type: Schema.Types.ObjectId, ref: "Phase", required: false },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule" },
    sessionType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    zoomLink: { type: String }, // might be internal starting link
    join_url: { type: String }, // secure URL for students
    zoomMeetingId: { type: String },

    // Junior Age Group (9-12)
    zoomLinkJunior: { type: String },
    joinUrlJunior: { type: String },
    zoomMeetingIdJunior: { type: String },

    // Senior Age Group (13-18)
    zoomLinkSenior: { type: String },
    joinUrlSenior: { type: String },
    zoomMeetingIdSenior: { type: String },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const SessionModel = model<ISession>("Session", sessionSchema);
