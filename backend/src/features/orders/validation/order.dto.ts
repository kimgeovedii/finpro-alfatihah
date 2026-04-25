import { z } from "zod";

export const AddToOrderSchema = z.object({
    cartId: z.string().uuid({ message: "Invalid product ID" }),
    voucherId: z.string().uuid({ message: "Invalid voucher ID" }).optional(),
    addressId: z.string().uuid({ message: "Invalid address ID" }),
    paymentMethod: z.enum(['MANUAL', 'GATEWAY']),
})