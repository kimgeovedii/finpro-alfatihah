import { apiFetch } from "@/utils/api";
import Cookies from "js-cookie";

export const authService = {
  register: async (data: any) => {
    return apiFetch<any>("/auth/register", "post", data);
  },

  verifyAndSetPassword: async (data: any) => {
    return apiFetch<any>("/auth/verify-set-password", "post", data);
  },

  login: async (data: any) => {
    const result: any = await apiFetch<any>("/auth/login", "post", data);
    const { user, accessToken, refreshToken } = result;
    
    // Set cookies for middleware
    Cookies.set("accessToken", accessToken, { expires: data.rememberMe ? 30 : 1 / 96 }); // 15 mins approx
    Cookies.set("refreshToken", refreshToken, { expires: data.rememberMe ? 30 : 1 });

    return { user, accessToken, refreshToken };
  },

  googleLogin: async (credential: string) => {
    const result: any = await apiFetch<any>("/auth/google", "post", { credential });
    const { user, accessToken, refreshToken } = result;
    
    Cookies.set("accessToken", accessToken, { expires: 30 });
    Cookies.set("refreshToken", refreshToken, { expires: 30 });

    return { user, accessToken, refreshToken };
  },

  logout: async () => {
    const refreshToken = Cookies.get("refreshToken");
    try {
      if (refreshToken) {
        await apiFetch<any>("/auth/logout", "post", { refreshToken });
      }
    } catch (err) {
      console.warn("Logout request failed, but clearing local session anyway.", err);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },

  requestResetPassword: async (email: string) => {
    return apiFetch<any>("/auth/reset-password", "post", { email });
  },

  confirmResetPassword: async (data: any) => {
    return apiFetch<any>("/auth/confirm-reset-password", "post", data);
  },

  resendVerification: async (email: string) => {
    return apiFetch<any>("/auth/resend-verification", "post", { email });
  },

  me: async () => {
    return apiFetch<any>("/auth/me", "get");
  }
};
