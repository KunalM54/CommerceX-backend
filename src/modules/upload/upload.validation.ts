import { z } from "zod";

export const uploadImageSchema = z.object({
  // Base64 data URL of the image (e.g. data:image/png;base64,....)
  file: z.string().trim().min(1, "Image data is required"),
  // Optional human friendly file name (without extension)
  fileName: z.string().trim().max(255).optional(),
});

export type UploadImageDto = z.infer<typeof uploadImageSchema>;
