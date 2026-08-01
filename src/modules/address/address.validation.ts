import { z } from "zod";

const addressFields = {
  type: z.enum(["SHIPPING", "BILLING"]),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  phone: z.string().trim().min(7, "Phone is required").max(15),
  line1: z.string().trim().min(3, "Address line 1 is required").max(200),
  line2: z.string().trim().max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  country: z.string().trim().min(2, "Country is required").max(100),
  pincode: z.string().trim().min(3, "Pincode is required").max(10),
};

export const createAddressSchema = z.object({
  ...addressFields,
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
  country: addressFields.country.default("India"),
});

export type CreateAddressDto = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = z
  .object({
    ...addressFields,
    type: z.enum(["SHIPPING", "BILLING"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });

export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;
