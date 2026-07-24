import { Schema, model, Document, Types } from 'mongoose';

export type EnrolleeType = 'SELF' | 'CHILD';
export type SubjectPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface IEnrollmentSubject {
  name: string;
  priority: SubjectPriority;
}

export interface IEnrollmentTimeBlock {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
}

export interface IEnrollment extends Document {
  enrolleeType: EnrolleeType;
  user?: Types.ObjectId;
  child?: Types.ObjectId;
  parent: Types.ObjectId;
  program: Types.ObjectId;
  /** Standard programs */
  phase?: Types.ObjectId;
  batch?: Types.ObjectId;
  selectedSchedules: Types.ObjectId[];
  /** Academic tutorial */
  package?: Types.ObjectId;
  subjects: IEnrollmentSubject[];
  timeBlocks: IEnrollmentTimeBlock[];
  /** IANA timezone for tutoring timeBlocks (parent local), e.g. America/New_York */
  scheduleTimeZone?: string;
  notes?: string;
  billingType: 'ONE_TIME' | 'MONTHLY';
  stripeSubscriptionId?: string;
  subscriptionCancelAtPeriodEnd?: boolean;
  subscriptionCanceledAt?: Date;
  subscriptionCanceledBy?: 'PARENT' | 'ADMIN';
  /** When cancel-at-period-end is set, access/billing continues until this date */
  subscriptionCurrentPeriodEnd?: Date;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod?: 'STRIPE' | 'ZELLE';
  zelleSubmittedAt?: Date;
  amount: number;
  transactionId?: string;
  isExistingChild: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSubjectSchema = new Schema<IEnrollmentSubject>(
  {
    name: { type: String, required: true },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
  },
  { _id: false }
);

const EnrollmentTimeBlockSchema = new Schema<IEnrollmentTimeBlock>(
  {
    dayOfWeek: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { _id: false }
);

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
    phase: { type: Schema.Types.ObjectId, ref: 'Phase', required: false },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: false },
    selectedSchedules: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }],
    package: { type: Schema.Types.ObjectId, ref: 'TutoringPackage', required: false, index: true },
    subjects: { type: [EnrollmentSubjectSchema], default: [] },
    timeBlocks: { type: [EnrollmentTimeBlockSchema], default: [] },
    scheduleTimeZone: { type: String, trim: true },
    notes: { type: String, trim: true },
    billingType: {
      type: String,
      enum: ['ONE_TIME', 'MONTHLY'],
      default: 'ONE_TIME',
    },
    stripeSubscriptionId: { type: String },
    subscriptionCancelAtPeriodEnd: { type: Boolean, default: false },
    subscriptionCanceledAt: { type: Date },
    subscriptionCanceledBy: { type: String, enum: ['PARENT', 'ADMIN'] },
    subscriptionCurrentPeriodEnd: { type: Date },
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

  const hasPackage = !!this.package;
  const hasPhase = !!this.phase;
  if (!hasPackage && !hasPhase) {
    this.invalidate('phase', 'phase or package is required');
  }
  if (!hasPackage && !this.batch) {
    this.invalidate('batch', 'batch is required for standard enrollments');
  }

  next();
});

export const EnrollmentModel = model<IEnrollment>('Enrollment', EnrollmentSchema);
