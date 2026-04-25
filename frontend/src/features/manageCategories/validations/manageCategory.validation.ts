import * as Yup from "yup";

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  slugName: Yup.string()
    .min(3, "Slug name must be at least 3 characters")
    .required("Slug name is required"),
  description: Yup.string()
    .max(200, "Description must be at most 200 characters")
    .required("Description is required"),
});
