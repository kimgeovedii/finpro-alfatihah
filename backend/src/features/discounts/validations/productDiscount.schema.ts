import { z } from "zod";

export const assignProductsSchema = z.object({
  productIds: z
    .array(z.uuid("Invalid Product ID format"))
    .min(1, "At least one product ID must be provided"),
});
