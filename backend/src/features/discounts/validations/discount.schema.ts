import { z } from "zod";

export const createDiscountSchema = z
  .object({
    name: z.string().min(3, "Name is required"),
    discountType: z.enum([
      "PRODUCT_DISCOUNT",
      "BUY_ONE_GET_ONE_FREE",
      "MINIMUM_PURCHASE",
    ]),
    discountValueType: z.enum(["PERCENTAGE", "NOMINAL"]),
    discountValue: z.number().min(0, "Value is required"),
    minPurchaseAmount: z
      .number()
      .min(0, "Min Purchase Amount must be 0 or greater")
      .optional(),
    maxDiscountAmount: z.number().min(0, "Max Discount Amount is required"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    quota: z.number().min(0, "Quota is required"),
    branchId: z.string().min(1, "Branch is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End Date must be after Start Date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (data.discountValueType === "PERCENTAGE") {
        return data.discountValue <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discountValue"],
    },
  );

export const updateDiscountSchema = z
  .object({
    name: z.string().min(3, "Name is required").optional(),
    discountType: z
      .enum(["PRODUCT_DISCOUNT", "BUY_ONE_GET_ONE_FREE", "MINIMUM_PURCHASE"])
      .optional(),
    discountValueType: z.enum(["PERCENTAGE", "NOMINAL"]).optional(),
    discountValue: z.number().min(0, "Value is required").optional(),
    minPurchaseAmount: z
      .number()
      .min(0, "Min Purchase Amount must be 0 or greater")
      .optional(),
    maxDiscountAmount: z
      .number()
      .min(0, "Max Discount Amount is required")
      .optional(),
    startDate: z.string().min(1, "Start Date is required").optional(),
    endDate: z.string().min(1, "End Date is required").optional(),
    quota: z.number().min(0, "Quota is required").optional(),
    branchId: z.string().min(1, "Branch is required").optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: "End Date must be after Start Date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (
        data.discountValueType === "PERCENTAGE" &&
        data.discountValue !== undefined
      ) {
        return data.discountValue <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discountValue"],
    },
  );
