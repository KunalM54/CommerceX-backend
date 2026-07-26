import { User, UserRole } from "../user/user.model.js";
import type { RegisterUserDto } from "./dto/register.dto.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword } from "../../utils/password.js";
import type { LoginDto } from "./dto/login.dto.js";
import { createUser } from "../user/user.service.js";
import { buildUserResponse } from "../user/user.mapper.js";
import { generateOtp } from "../../utils/otp.js";
import { PhoneOtp } from "../phoneOtp/phoneOtp.model.js";

export const registerUser = async (userData: RegisterUserDto) => {
  const user = await createUser({
    ...userData,
    role: UserRole.CUSTOMER,
  });

  return buildUserResponse(user);
};

export const loginUser = async (loginDto: LoginDto) => {
  const { email, password } = loginDto;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account has been deactivated");
  }

  return buildUserResponse(user);
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return buildUserResponse(user);
};

export const sendPhoneOtp = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.phone) {
    throw new AppError(400, "Phone number is not available");
  }

  if (user.isPhoneVerified) {
    throw new AppError(400, "Phone number is already verified");
  }

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const existingOtp = await PhoneOtp.findOneAndUpdate(
    { phone: user.phone },
    {
      otp,
      expiresAt,
    },
    {
      upsert: true,
      new: true,
    },
  );

  console.log("User Phone No : ", user.phone, " and OTP is : ", otp);

  return {
    message: "OTP sent successfully",
  };
};

export const verifyPhoneOtp = async (userId: string, otp: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.phone) {
    throw new AppError(400, "Phone number is not available");
  }

  if (user.isPhoneVerified) {
    throw new AppError(400, "Phone number is already verified");
  }

  const phoneOtp = await PhoneOtp.findOne({
    phone: user.phone,
  });

  if (!phoneOtp) {
    throw new AppError(400, "Invalid or expired OTP");
  }

  if (phoneOtp.expiresAt < new Date()) {
    throw new AppError(400, "OTP has expired");
  }

  if (phoneOtp.otp !== otp) {
    throw new AppError(400, "Invalid OTP");
  }

  user.isPhoneVerified = true;
  await user.save();

  await PhoneOtp.deleteOne({
    phone: user.phone,
  });

  return {
    message: "Phone number verified successfully",
  };
};
