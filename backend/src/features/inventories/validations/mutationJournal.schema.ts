import { z } from "zod";

export const createMutationSchema = z
  .object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    sourceBranchId: z.string().min(1, "Source Branch is required"),
    destinationBranchId: z.string().min(1, "Destination Branch is required"),
    notes: z.string().optional(),
  })
  .refine((data) => data.sourceBranchId !== data.destinationBranchId, {
    message: "Source and destination branches cannot be the same",
    path: ["destinationBranchId"],
  });

export const updateMutationStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "RECEIVED", "CANCELLED"]),
  notes: z.string().optional(),
});
