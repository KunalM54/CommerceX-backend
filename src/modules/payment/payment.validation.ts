import { z } from "zod";

export const directCheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().trim().min(1, "Variant is required"),
        quantity: z.number().int().positive("Quantity must be greater than 0"),
      }),
    )
    .min(1, "At least one item is required"),
});

export type DirectCheckoutDto = z.infer<typeof directCheckoutSchema>;
