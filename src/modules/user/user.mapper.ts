import type { UserResponse } from "./user.types.js";

export const buildUserResponse = (user: any): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};
