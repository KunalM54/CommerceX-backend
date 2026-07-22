import { User, UserRole } from "../user/user.model.js";
import type { RegisterUserDto } from "./dto/register.dto.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword } from "../../utils/password.js";
import type { LoginDto } from "./dto/login.dto.js";
import { createUser } from "../user/user.service.js";
import { buildUserResponse } from "../user/user.mapper.js";

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

  return buildUserResponse(user);;
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select("_id name email role");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return buildUserResponse(user);;
};
