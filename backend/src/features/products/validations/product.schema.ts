import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(3, "Name is required"),
  slugName: z.string().min(3, "Slug Name is required"),
  description: z.string().min(3, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.coerce.number().min(0, "Price is required"),
  sku: z.string().min(1, "SKU is required"),
  weight: z.coerce.number().min(0, "Weight is required"),
});

export const updateProductSchema = z.object({
  productName: z.string().min(3, "Name is required").optional(),
  slugName: z.string().min(3, "Slug Name is required").optional(),
  description: z.string().min(3, "Description is required").optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  basePrice: z.coerce.number().min(0, "Price is required").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  weight: z.coerce.number().min(0, "Weight is required").optional(),
});
