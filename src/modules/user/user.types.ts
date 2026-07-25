import z from "zod";
import { UserRole } from "./user.model.js";
import { updateUserSchema } from "./user.validation.js";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
