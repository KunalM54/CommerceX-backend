import { Schema, model, type Types } from "mongoose";

export interface IPayment {
  order: Types.ObjectId;
  user: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  status: "initiated" | "captured" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["initiated", "captured", "failed"],
      default: "initiated",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
