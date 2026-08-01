import { z } from "zod";

const variantSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required").max(100),
  attributes: z.record(z.string(), z.string()).optional(),
  sku: z.string().trim().min(1, "SKU is required").max(50),
  price: z.number().positive("Price must be greater than 0"),
  images: z.array(z.string().trim()).optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().trim().max(1000).optional(),
  categoryId: z.string().trim().min(1, "Category is required"),
  brandId: z.string().trim().min(1, "Brand is required"),
  images: z.array(z.string().trim()).optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().max(1000).optional(),
    categoryId: z.string().trim().min(1).optional(),
    brandId: z.string().trim().min(1).optional(),
    images: z.array(z.string().trim()).optional(),
    variants: z.array(variantSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
