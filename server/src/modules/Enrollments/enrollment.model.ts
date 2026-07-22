import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  child: Types.ObjectId;
  parent: Types.ObjectId;
  program: Types.ObjectId;
  phase: Types.ObjectId;
  batch: Types.ObjectId;
  selectedSchedules: Types.ObjectId[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  amount: number;
  transactionId?: string;
  isExistingChild: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    child: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    phase: { type: Schema.Types.ObjectId, ref: 'Phase', required: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    selectedSchedules: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }],
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID'],
      default: 'UNPAID',
    },
    amount: { type: Number, required: true },
    transactionId: { type: String },
    isExistingChild: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const EnrollmentModel = model<IEnrollment>('Enrollment', EnrollmentSchema);
