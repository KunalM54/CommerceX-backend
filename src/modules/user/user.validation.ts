import z from "zod";
import { UserRole } from "./user.model.js";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    email: z.email().trim().toLowerCase().optional(),

    role: z.enum(Object.values(UserRole)).optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required.",
    }
  );