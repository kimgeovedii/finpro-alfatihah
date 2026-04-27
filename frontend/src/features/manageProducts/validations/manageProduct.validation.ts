import * as Yup from "yup";

export const manageProductValidationSchema = Yup.object({
  productName: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Product name is required"),
  slugName: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Slug is required"),
  description: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Description is required"),
  categoryId: Yup.string().required("Category is required"),
  basePrice: Yup.number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  sku: Yup.string().min(1, "SKU is required").required("SKU is required"),
  weight: Yup.number()
    .min(0, "Weight must be positive")
    .required("Weight is required"),
  images: Yup.mixed()
    .required("At least one image is required")
    .test("isArray", "Images must be an array", (value) => {
      if (!value) return false;
      return Array.isArray(value);
    })
    .test("arrayLength", "At least one image is required", (value) => {
      if (!Array.isArray(value)) return false;
      return value.length > 0;
    })
    .test("fileSize", "Each file must be less than 1MB", (value) => {
      if (!Array.isArray(value)) return true;
      return value.every((file) => (file as File).size <= 1024 * 1024);
    })
    .test("fileType", "Only PNG, JPG, JPEG, or WEBP files are allowed", (value) => {
      if (!Array.isArray(value)) return true;
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      return value.every((file) => validTypes.includes((file as File).type));
    }),
});


