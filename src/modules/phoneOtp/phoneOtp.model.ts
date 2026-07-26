import { model, Schema } from "mongoose";

const phoneOtpSchema = new Schema({
  phone: {
    type: String,
    required: true,
    trim : true
  },
  otp: {
    type: String,
    required : true
  },
  expiresAt : {
    type : Date,
    required : true,
  }
},
{
    timestamps : true
});

export const PhoneOtp = model("PhoneOtp",phoneOtpSchema);


