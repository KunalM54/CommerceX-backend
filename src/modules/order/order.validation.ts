import { z } from "zod";

export const checkoutSchema = z.object({
  shippingAddressId: z
    .string()
    .trim()
    .min(1, "Shipping address is required"),
  billingAddressId: z.string().trim().min(1).optional(),
});

export type CheckoutDto = z.infer<typeof checkoutSchema>;
