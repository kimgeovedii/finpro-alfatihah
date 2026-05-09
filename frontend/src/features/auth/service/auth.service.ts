import { apiFetch } from "@/utils/api";
import Cookies from "js-cookie";
import { 
  AuthResponse, 
  LoginPayload, 
  RegisterPayload, 
  VerifyPayload, 
  MessageResponse,
  User
} from "../types";

export const authService = {
  register: async (data: RegisterPayload) => {
    return apiFetch<MessageResponse>("/auth/register", "post", data);
  },

  verifyAndSetPassword: async (data: VerifyPayload) => {
    return apiFetch<MessageResponse>("/auth/verify-set-password", "post", data);
  },

  verifyEmailOnly: async (token: string) => {
    return apiFetch<MessageResponse>("/auth/verify-email-only", "post", { token });
  },

  login: async (data: LoginPayload) => {
    const result = await apiFetch<AuthResponse>("/auth/login", "post", data);
    const { user, accessToken, refreshToken } = result;
    
    // Set cookies for middleware
    Cookies.set("accessToken", accessToken, { expires: data.rememberMe ? 30 : 1 / 96 }); // 15 mins approx
    Cookies.set("refreshToken", refreshToken, { expires: data.rememberMe ? 30 : 1 });

    return { user, accessToken, refreshToken };
  },

  employeeLogin: async (data: LoginPayload) => {
    const result = await apiFetch<AuthResponse>("/auth/login/employee", "post", data);
    const { user, accessToken, refreshToken } = result;
    
    // Set cookies for middleware
    Cookies.set("accessToken", accessToken, { expires: data.rememberMe ? 30 : 1 / 96 }); 
    Cookies.set("refreshToken", refreshToken, { expires: data.rememberMe ? 30 : 1 });

    return { user, accessToken, refreshToken };
  },

  googleLogin: async (data: { credential: string; deviceId?: string }) => {
    const result = await apiFetch<AuthResponse>("/auth/google", "post", data);
    const { user, accessToken, refreshToken } = result;
    
    Cookies.set("accessToken", accessToken, { expires: 30 });
    Cookies.set("refreshToken", refreshToken, { expires: 30 });

    return { user, accessToken, refreshToken };
  },

  logout: async (isEmployee?: boolean) => {
    const refreshToken = Cookies.get("refreshToken");
    try {
      if (refreshToken) {
        await apiFetch<MessageResponse>("/auth/logout", "post", { refreshToken });
      }
    } catch (err) {
      console.warn("Logout request failed, but clearing local session anyway.", err);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = isEmployee ? "/login/employee" : "/login";
      }
    }
  },

  requestResetPassword: async (email: string) => {
    return apiFetch<MessageResponse>("/auth/reset-password", "post", { email });
  },

  confirmResetPassword: async (data: VerifyPayload) => {
    return apiFetch<MessageResponse>("/auth/confirm-reset-password", "post", data);
  },

  resendVerification: async (email: string) => {
    return apiFetch<MessageResponse>("/auth/resend-verification", "post", { email });
  },

  me: async () => {
    return apiFetch<User>("/auth/me", "get");
  }
};
