import { hashPassword } from "../../utils/password.js";
import { User } from "./user.model.js";
import { AppError } from "../../utils/AppError.js";
import type { createUserDto } from "./dto/create-user.dto.js";
import { buildUserResponse } from "./user.mapper.js";
import mongoose from "mongoose";

export const createUser = async (userData: createUserDto) => {
  const existingUser = await User.findOne({
    email: userData.email,
  });

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return buildUserResponse(user);
};

export const getAllUser = async () => {
  const users = await User.find();

  return users.map(buildUserResponse);
};

export const getUserById = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return buildUserResponse(user);
};
