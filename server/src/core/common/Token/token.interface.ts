import { type Document, Schema, Types } from 'mongoose';

export interface IToken extends Document {
  createdAt: Date;
  token: string;
  userId: Schema.Types.ObjectId;
}

export interface ITokenPayload {
  _id: Types.ObjectId;
  role: Types.ObjectId[];
  type: 'adult' | 'child';
}

export interface ITokenService {
  accessToken: string;
  refreshToken: string;
}
