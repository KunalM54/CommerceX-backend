import { User } from "../user/user.model.js";
import type { RegisterUserDto } from "./dto/register.dto.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import type { LoginDto } from "./dto/login.dto.js";

export const registerUser = async (userData: RegisterUserDto) => {
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

  return user;
};

export const loginUser = async (loginDto: LoginDto) => {
  const { email, password } = loginDto;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  return user;
};

export const getUserProfile = async(userId : string) => {
  const user = await User.findById(userId).select("_id name email role");

  if(!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}

