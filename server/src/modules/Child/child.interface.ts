import { Types } from 'mongoose';

export interface IChild {
  _id: Types.ObjectId;
  parentId: Types.ObjectId;
  firstname: string;
  lastname: string;
  username?: string;
  profilePic?: string;
  dateOfBirth: Date;
  gender: string;
  grade: string;
  parentNotes?: string;
  pinHash: string;
  status: 'active' | 'paused';
  preferences?: {
    language?: string;
    difficulty?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
