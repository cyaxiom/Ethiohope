import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: Types.ObjectId[];
  lastLogin?: Date;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  status?: 'active' | 'suspended' | 'blocked';
  isOnline: boolean;
  lastSeen?: Date;
  
  // PARENT PROFILE FIELDS
  parentType?: 'mother' | 'father' | 'guardian' | 'other';
  phone?: string;
  phoneVerified: boolean;
  country?: string;
  state?: string;
  city?: string;
  isProfileComplete?: boolean;

  createdAt: Date;
  updatedAt: Date;
}