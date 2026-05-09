import * as Yup from "yup";

export const manageAccountValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Username is required"),
  fullName: Yup.string()
    .min(3, "Minimum 3 characters")
    .required("Full name is required"),
  role: Yup.string()
    .oneOf(["STORE_ADMIN", "SUPER_ADMIN"], "Invalid role")
    .required("Role is required"),
  branchId: Yup.string().required("Branch is required"),
});

export const updateAccountValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email"),
  username: Yup.string().min(3, "Minimum 3 characters"),
  fullName: Yup.string().min(3, "Minimum 3 characters"),
  role: Yup.string().oneOf(["STORE_ADMIN", "SUPER_ADMIN"], "Invalid role"),
  branchId: Yup.string(),
});
