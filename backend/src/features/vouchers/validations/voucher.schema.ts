import { z } from "zod";

export const createVoucherSchema = z.object({
  name: z.string().min(3, "Name is required"),
  voucherCode: z.string().trim().length(6, "Voucher code must be 6 characters"),
  type: z.enum(["ORDER", "SHIPPING_COST"]),
  discountValueType: z.enum(["PERCENTAGE", "NOMINAL"]),
  discountValue: z.number().min(0, "Discount value must be non-negative"),
  minPurchaseAmount: z.number().min(0, "Minimum purchase must be non-negative"),
  maxDiscountAmount: z.number().min(0, "Maximum discount must be non-negative"),
  quota: z.number().min(0, "Quota must be non-negative"),
  expiredDate: z.coerce
    .date()
    .min(new Date(), "Expired date must be after today"),
});

export const updateVoucherSchema = z.object({
  name: z.string().min(3, "Name is required").optional(),
  voucherCode: z
    .string()
    .trim()
    .length(6, "Voucher code must be 6 characters")
    .optional(),
  type: z.enum(["ORDER", "SHIPPING_COST"]).optional(),
  discountValueType: z.enum(["PERCENTAGE", "NOMINAL"]).optional(),
  discountValue: z
    .number()
    .min(0, "Discount value must be non-negative")
    .optional(),
  minPurchaseAmount: z
    .number()
    .min(0, "Minimum purchase must be non-negative")
    .optional(),
  maxDiscountAmount: z
    .number()
    .min(0, "Maximum discount must be non-negative")
    .optional(),
  quota: z.number().min(0, "Quota must be non-negative").optional(),
  expiredDate: z.coerce
    .date()
    .min(new Date(), "Expired date must be after today")
    .optional(),
});
