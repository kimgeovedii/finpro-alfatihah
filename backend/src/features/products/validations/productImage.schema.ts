import { z } from "zod";

export const createProductImageSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  imageUrl: z.string().min(1, "Image is required"),
  isPrimary: z.boolean().optional(),
});

export const updateProductImageSchema = z.object({
  productId: z.string().min(1, "Product is required").optional(),
  imageUrl: z.string().min(1, "Image is required").optional(),
  isPrimary: z.boolean().optional(),
});
