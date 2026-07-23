import { Schema, model, Document, Types } from 'mongoose';

export interface IChild extends Document {
  firstname: string;
  lastname: string;
  username: string; // unique
  pin: string;      // hashed
  plainPin?: string; 
  parent: Types.ObjectId; // Reference to User
  gender: 'male' | 'female';
  birthdate?: Date;
  grade: string;
  isUSA: boolean;
  country?: string;
  region?: string;
  status: 'active' | 'suspended';
  isOnline: boolean;
  lastSeen?: Date;
}

const ChildSchema = new Schema<IChild>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    plainPin: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    birthdate: { type: Date, required: false },
    grade: { type: String },
    isUSA: { type: Boolean, default: false },
    country: { type: String },
    region: { type: String },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ChildSchema.virtual('age').get(function() {
  if (!this.birthdate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

export const ChildModel = model<IChild>('Child', ChildSchema);
