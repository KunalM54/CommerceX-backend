import { Schema, model, Types } from "mongoose";

export interface IPasswordReset {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const PasswordReset = model<IPasswordReset>("PasswordReset", passwordResetSchema);
