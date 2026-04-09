import { z } from "zod";

export const UpdateCartItemQtySchema = z.object({
    qty: z.number().int().min(1, { message: "Quantity must be at least 1" }),
})