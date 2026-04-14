import { z } from "zod";

export const AddToCartSchema = z.object({
    productId: z.string().uuid({ message: "Invalid product ID" }),
    branchId: z.string().uuid({ message: "Invalid branch ID" }),
    qty: z.number().int().min(1, { message: "Quantity must be at least 1" }).nullable(),
})