import { Schema, model } from "mongoose";

const ParentProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  parentType: {
    type: String,
    enum: ['father', 'mother', 'guardian', 'other'],
    required: true
  },
  phone: { type: String, required: true },

  address: {
    country: { type: String, default: 'US' },
    state: { type: String, required: true },
    city: { type: String, required: true }
  }

}, { timestamps: true });

export const ParentProfile = model('ParentProfile', ParentProfileSchema);