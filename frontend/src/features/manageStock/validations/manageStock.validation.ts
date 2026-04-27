import * as Yup from "yup";

export const updateStockValidationSchema = Yup.object().shape({
  actualStock: Yup.number()
    .min(0, "Stock cannot be negative")
    .required("Stock level is required"),
  notes: Yup.string()
    .min(5, "Reason must be at least 5 characters")
    .required("Please provide a reason for this stock adjustment"),
  productId: Yup.string().when("isNew", {
    is: true,
    then: (schema) => schema.required("Product is required"),
  }),
  branchId: Yup.string().when("isNew", {
    is: true,
    then: (schema) => schema.required("Branch is required"),
  }),
});
