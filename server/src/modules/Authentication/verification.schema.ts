import { Schema, model, Document } from 'mongoose';

export interface IVerificationCode extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expire in 10 minutes (600 seconds)
});

const VerificationCode = model<IVerificationCode>('VerificationCode', verificationCodeSchema);

export default VerificationCode;
