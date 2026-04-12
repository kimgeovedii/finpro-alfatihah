import { z } from "zod";

export const createDiscountSchema = z.object({
  name: z.string().min(3, "Name is required"),
  discountType: z.enum([
    "PRODUCT_DISCOUNT",
    "BUY_ONE_GET_ONE_FREE",
    "MINIMUM_PURCHASE",
  ]),
  discountValueType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0, "Value is required"),
  maxDiscountAmount: z.number().min(0, "Max Discount Amount is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  quota: z.number().min(0, "Quota is required"),
  branchId: z.string().min(1, "Branch is required"),
});

export const updateDiscountSchema = z.object({
  name: z.string().min(3, "Name is required").optional(),
  discountType: z
    .enum(["PRODUCT_DISCOUNT", "BUY_ONE_GET_ONE_FREE", "MINIMUM_PURCHASE"])
    .optional(),
  discountValueType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().min(0, "Value is required").optional(),
  maxDiscountAmount: z
    .number()
    .min(0, "Max Discount Amount is required")
    .optional(),
  startDate: z.string().min(1, "Start Date is required").optional(),
  endDate: z.string().min(1, "End Date is required").optional(),
  quota: z.number().min(0, "Quota is required").optional(),
  branchId: z.string().min(1, "Branch is required").optional(),
});
