import { UserRole } from "./user.model.js";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};
