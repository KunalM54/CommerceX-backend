import { z } from "zod";

export const createInventorySchema = z.object({
  productId: z.string().trim().min(1, "Product is required"),
  variantId: z.string().trim().min(1, "Variant is required"),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  lowStockThreshold: z
    .number()
    .int()
    .min(0, "Threshold cannot be negative")
    .optional(),
});

export type CreateInventoryDto = z.infer<typeof createInventorySchema>;

export const updateInventorySchema = z
  .object({
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    lowStockThreshold: z
      .number()
      .int()
      .min(0, "Threshold cannot be negative")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });

export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;

export const adjustStockSchema = z.object({
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  operation: z.enum(["increase", "decrease"]),
});

export type AdjustStockDto = z.infer<typeof adjustStockSchema>;

export const reserveStockSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().trim().min(1, "Variant is required"),
        quantity: z.number().int().positive("Quantity must be greater than 0"),
      }),
    )
    .min(1, "At least one item is required"),
});

export type ReserveStockDto = z.infer<typeof reserveStockSchema>;
