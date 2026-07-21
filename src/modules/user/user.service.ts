import { hashPassword } from "../../utils/password.js";
import { User } from "./user.model.js";
import { AppError } from "../../utils/AppError.js"; 
import type { createUserDto } from "./dto/create-user.dto.js";

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

  return user;
};
