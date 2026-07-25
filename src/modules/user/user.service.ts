import { hashPassword } from "../../utils/password.js";
import { User } from "./user.model.js";
import { AppError } from "../../utils/AppError.js";
import type { createUserDto } from "./dto/create-user.dto.js";
import { buildUserResponse } from "./user.mapper.js";
import mongoose from "mongoose";
import type { UpdateUserBody } from "./user.types.js";

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

export const updateUser = async (id: string, payload: UpdateUserBody) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (payload.email && payload.email !== user.email) {
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new AppError(409, "Email already exists");
    }
  }

  if (payload.name !== undefined) {
    user.name = payload.name;
  }

  if (payload.email !== undefined) {
    user.email = payload.email;
  }

  if (payload.role !== undefined) {
    user.role = payload.role;
  }

  if (payload.isActive !== undefined) {
    user.isActive = payload.isActive;
  }

  await user.save();

  return buildUserResponse(user);
};

export const deleteUser = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user ID");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.isActive) {
    throw new AppError(400, "User is already inactive");
  }

  user.isActive = false;
  await user.save();

  return buildUserResponse(user);
};
