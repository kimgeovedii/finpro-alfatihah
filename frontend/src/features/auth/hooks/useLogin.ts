import { useRouter, useSearchParams } from "next/navigation";
import { useAuthService } from "../hooks/useAuthService";
import { LoginPayload } from "../types";
import { useFormik } from "formik";
import { loginValidationSchema } from "../validations/auth.validation";
import toast from "react-hot-toast";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthService();

  // Support redirect back after login
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (payload: LoginPayload) => {
    clearError();
    try {
      await login(payload);
      toast.success("Login berhasil!");
      router.push(redirectTo);
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("verifikasi")) {
        clearError();
        router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  return {
    formik,
    error,
    isLoading,
  };
};
