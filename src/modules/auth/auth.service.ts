import { User } from "../user/user.model.js";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/password.js";

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
