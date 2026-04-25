import * as Yup from "yup";

export const setPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .matches(/[A-Z]/, "Minimal 1 huruf besar")
    .matches(/[0-9]/, "Minimal 1 angka")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});

export const registerValidationSchema = Yup.object({
  email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
});

export const resetPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
});

export const confirmResetPasswordValidationSchema = Yup.object({
  password: Yup.string().min(6, "Password minimal 6 karakter").required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});
