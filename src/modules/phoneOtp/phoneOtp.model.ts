import { model, Schema } from "mongoose";

export interface IPhoneOtp {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const phoneOtpSchema = new Schema<IPhoneOtp>(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PhoneOtp = model<IPhoneOtp>("PhoneOtp", phoneOtpSchema);
