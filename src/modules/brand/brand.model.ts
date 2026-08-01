import { Schema, model } from "mongoose";

export interface IBrand {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Brand = model<IBrand>("Brand", brandSchema);
