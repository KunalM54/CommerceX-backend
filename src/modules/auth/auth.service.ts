import { User, UserRole } from "../user/user.model.js";
import type { RegisterUserDto } from "./dto/register.dto.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import type { LoginDto } from "./dto/login.dto.js";
import { createUser } from "../user/user.service.js";
import { buildUserResponse } from "../user/user.mapper.js";
import { generateOtp } from "../../utils/otp.js";
import { PhoneOtp } from "../phoneOtp/phoneOtp.model.js";
import crypto from "crypto";
import { PasswordReset } from "./passwordReset.model.js";
import z from "zod";

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

  await PhoneOtp.updateOne(
    { phone: user.phone! },
    { $set: { otp, expiresAt } },
    { upsert: true },
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

export const forgotPassword = async (identifier: string) => {
  const isEmail = z.string().email().safeParse(identifier).success;

  const user = isEmail
    ? await User.findOne({ email: identifier })
    : await User.findOne({ phone: identifier });

  if (!user) {
    return { message: "If an account exists, a reset link has been sent." };
  }

  if (isEmail) {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordReset.findOneAndUpdate(
      { userId: user._id },
      {
        token: hashedToken,
        expiresAt,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    console.log("Password Reset Token for", user.email, ":", resetToken);
    console.log("Use POST /auth/reset-password with email + this token");

    return {
      message: "If an account exists, a reset link has been sent.",
    };
  } else {
    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PhoneOtp.updateOne(
      { phone: user.phone! },
      { $set: { otp, expiresAt } },
      { upsert: true },
    );

    console.log("Password Reset OTP for", user.phone, ":", otp);
    console.log("Use POST /auth/reset-password with phone + this OTP");

    return {
      message: "If an account exists, an OTP has been sent.",
    };
  }
};

export const resetPassword = async (
  identifier: string,
  tokenOrOtp: string,
  newPassword: string,
) => {
  const isEmail = z.string().email().safeParse(identifier).success;

  const user = isEmail
    ? await User.findOne({ email: identifier }).select("+password")
    : await User.findOne({ phone: identifier }).select("+password");

  if (!user) {
    throw new AppError(400, "Invalid or expired reset request");
  }

  if (isEmail) {
    const resetRecord = await PasswordReset.findOne({ userId: user._id });

    if (!resetRecord) {
      throw new AppError(400, "Invalid or expired reset request");
    }

    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ userId: user._id });
      throw new AppError(400, "Reset token has expired");
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenOrOtp)
      .digest("hex");

    if (resetRecord.token !== hashedToken) {
      throw new AppError(400, "Invalid or expired reset request");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteOne({ userId: user._id });
  } else {
    if (!user.phone) {
      throw new AppError(400, "No phone number on this account");
    }

    const phoneOtp = await PhoneOtp.findOne({ phone: user.phone });

    if (!phoneOtp) {
      throw new AppError(400, "Invalid or expired reset request");
    }

    if (phoneOtp.expiresAt < new Date()) {
      await PhoneOtp.deleteOne({ phone: user.phone });
      throw new AppError(400, "OTP has expired");
    }

    if (phoneOtp.otp !== tokenOrOtp) {
      throw new AppError(400, "Invalid or expired reset request");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    await PhoneOtp.deleteOne({ phone: user.phone });
  }

  return { message: "Password reset successfully" };
};
