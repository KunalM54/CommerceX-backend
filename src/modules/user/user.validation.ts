import z from "zod";
import { UserRole } from "./user.model.js";

export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    email: z.email().trim().toLowerCase().optional(),

    role: z.enum(Object.values(UserRole)).optional(),

    phone: z
      .string()
      .trim()
      .regex(
        PHONE_REGEX,
        "Invalid phone number. Use E.164 format (e.g. +919876543210).",
      )
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });
