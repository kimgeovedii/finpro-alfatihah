import { useRouter } from "next/navigation";
import { useAuthService } from "../service/auth.service";
import { LoginPayload } from "../types";
import { useFormik } from "formik";
import { loginValidationSchema } from "../validations/auth.validation";

export const useLogin = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthService();

  const handleLogin = async (payload: LoginPayload) => {
    try {
      await login(payload);
      router.push("/dashboard");
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("verify your email")) {
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
