import { Schema, model, type Types } from "mongoose";

export enum AddressType {
  SHIPPING = "SHIPPING",
  BILLING = "BILLING",
}

export interface IAddress {
  user: Types.ObjectId;
  type: AddressType;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isActive: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(AddressType),
      default: AddressType.SHIPPING,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    line1: {
      type: String,
      required: true,
      trim: true,
    },
    line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
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

export const Address = model<IAddress>("Address", addressSchema);
