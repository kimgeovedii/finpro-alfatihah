import { z } from "zod";

export const createBranchInventorySchema = z.object({
  branchId: z.string().min(1, "Branch ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  currentStock: z.number().min(0, "Current stock must be 0 or greater"),
  notes: z.string().optional(),
});

export const updateBranchInventorySchema = z.object({
  actualStock: z.number().min(0, "Actual stock must be 0 or greater"),
  notes: z.string().min(1, "Notes are required for stock adjustments"),
});
