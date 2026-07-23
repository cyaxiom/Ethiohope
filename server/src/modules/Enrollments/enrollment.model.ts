import { Schema, model, Document, Types } from 'mongoose';

export type EnrolleeType = 'SELF' | 'CHILD';

export interface IEnrollment extends Document {
  enrolleeType: EnrolleeType;
  /** Adult learner (self-enrollment). Same as parent when enrolleeType is SELF. */
  user?: Types.ObjectId;
  /** Child learner (parent enrolls child). */
  child?: Types.ObjectId;
  /** Paying / registering adult user. */
  parent: Types.ObjectId;
  program: Types.ObjectId;
  phase: Types.ObjectId;
  batch: Types.ObjectId;
  selectedSchedules: Types.ObjectId[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod?: 'STRIPE' | 'ZELLE';
  /** Set when the payer reports they sent a Zelle transfer (awaiting admin confirmation). */
  zelleSubmittedAt?: Date;
  amount: number;
  transactionId?: string;
  isExistingChild: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    enrolleeType: {
      type: String,
      enum: ['SELF', 'CHILD'],
      default: 'CHILD',
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    child: { type: Schema.Types.ObjectId, ref: 'Child', required: false, index: true },
    parent: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
    paymentMethod: {
      type: String,
      enum: ['STRIPE', 'ZELLE'],
      required: false,
    },
    zelleSubmittedAt: { type: Date, required: false },
    amount: { type: Number, required: true },
    transactionId: { type: String },
    isExistingChild: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EnrollmentSchema.pre('validate', function (next) {
  const enrolleeType = this.enrolleeType || (this.child ? 'CHILD' : this.user ? 'SELF' : 'CHILD');
  this.enrolleeType = enrolleeType;

  if (enrolleeType === 'SELF') {
    if (!this.user) {
      this.invalidate('user', 'user is required for self-enrollment');
    }
    if (this.user && this.parent && this.user.toString() !== this.parent.toString()) {
      this.invalidate('user', 'self-enrollment user must match the registering user');
    }
  } else if (!this.child) {
    this.invalidate('child', 'child is required for child enrollment');
  }
  next();
});

export const EnrollmentModel = model<IEnrollment>('Enrollment', EnrollmentSchema);
