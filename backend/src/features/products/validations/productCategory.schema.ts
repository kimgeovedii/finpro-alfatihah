import { z } from "zod";

export const createProductCategoriesSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slugName: z.string().min(3, "Slug Name is required"),
  description: z.string().optional(),
});

export const updateProductCategoriesSchema = z.object({
  name: z.string().min(3, "Name is required").optional(),
  slugName: z.string().min(3, "Slug Name is required").optional(),
  description: z.string().optional(),
});
