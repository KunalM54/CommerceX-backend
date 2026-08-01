import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().trim().max(200).optional(),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;

export const updateBrandSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50).optional(),
    description: z.string().trim().max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });

export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;
