import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    roles: [
      { type: Schema.Types.ObjectId, ref: 'Role' }
    ],
    status: { type: String, enum: ["active", "suspended", "blocked"], default: "active", index: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false, index: true },
    verificationTokenExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false, index: true },
    passwordResetExpires: { type: Date, select: false },
    isOnline: { type: Boolean, default: false, index: true, },
    lastSeen: { type: Date, default: null },
    lastLogin: { type: Date, default: null },

    // Parent Profile Specific
    parentType: { type: String, enum: ["mother", "father", "guardian", "other"] },
    phone: { type: String, select: true, index: true },
    phoneVerified: { type: Boolean, default: true },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<IUser>("User", UserSchema);
