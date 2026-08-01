import { z } from "zod";

export const addItemSchema = z.object({
  variantId: z.string().trim().min(1, "Variant is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export type AddItemDto = z.infer<typeof addItemSchema>;

export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export type UpdateQuantityDto = z.infer<typeof updateQuantitySchema>;
