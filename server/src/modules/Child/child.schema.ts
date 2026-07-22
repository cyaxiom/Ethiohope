import { Schema, model } from "mongoose";

const ChildSchema = new Schema({
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  selectedPackageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },

  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  profilePic: String,
  generatedUsername: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  }, // auto-generated
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  grade: { type: String, required: true },
  parentNotes: String,

  schoolLocation: {
    inUSA: { type: Boolean, required: true },

    country: { type: String }, // required if inUSA = false
    state: { type: String, required: true }, // US state OR foreign state/city
  },

  generatedPin: { type: String, required: true, select: false },// auto-generated (hashed)

  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  },

  preferences: {
    language: String,
    difficulty: String
  }
}, { timestamps: true });


export const Child = model('Child', ChildSchema);