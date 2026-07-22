import { Schema, model } from "mongoose";

const PackageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    price: { type: Number, required: true },
    daysPerWeek: { type: Number, required: true },

    description: String,

    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Package = model('Package', PackageSchema);
