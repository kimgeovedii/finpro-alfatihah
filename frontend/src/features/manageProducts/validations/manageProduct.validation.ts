import * as Yup from "yup";

export const manageProductValidationSchema = Yup.object({
  productName: Yup.string().min(3, "Minimum 3 characters").required("Product name is required"),
  slugName: Yup.string().min(3, "Minimum 3 characters").required("Slug is required"),
  description: Yup.string().min(3, "Minimum 3 characters").required("Description is required"),
  categoryId: Yup.string().required("Category is required"),
  basePrice: Yup.number().min(0, "Price must be positive").required("Price is required"),
  sku: Yup.string().min(1, "SKU is required").required("SKU is required"),
  weight: Yup.number().min(0, "Weight must be positive").required("Weight is required"),
});
