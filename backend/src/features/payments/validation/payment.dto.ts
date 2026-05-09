import { z } from "zod";

export const ValidatePaymentEvidenceSchema = z.object({
    isConfirm: z.boolean()
})