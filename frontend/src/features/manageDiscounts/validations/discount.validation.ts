import * as Yup from "yup";

export const createDiscountSchema = Yup.object().shape({
  name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  discountType: Yup.string()
    .oneOf(["PRODUCT_DISCOUNT", "BUY_ONE_GET_ONE_FREE", "MINIMUM_PURCHASE"])
    .required("Discount type is required"),
  discountValueType: Yup.string()
    .oneOf(["PERCENTAGE", "NOMINAL"])
    .required("Value type is required"),
  discountValue: Yup.number()
    .min(0, "Value must be 0 or greater")
    .required("Discount value is required")
    .when("discountValueType", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(100, "Percentage cannot exceed 100"),
    }),
  minPurchaseAmount: Yup.number()
    .min(0, "Min Purchase Amount must be 0 or greater")
    .nullable(),
  maxDiscountAmount: Yup.number()
    .min(0, "Max Discount Amount must be 0 or greater")
    .required("Max discount amount is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  quota: Yup.number().min(0, "Quota must be 0 or greater").required("Quota is required"),
  branchId: Yup.string().required("Branch is required"),
});
