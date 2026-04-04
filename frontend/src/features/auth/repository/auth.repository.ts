import { LoginPayload, LoginResponse, User } from "../types";
import { apiFetch } from "@/utils/api";

export const authRepository = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", "post", payload);
  },
  
  async logout(refreshToken?: string): Promise<any> {
    return apiFetch<any>("/auth/logout", "post", { refreshToken });
  },

  async getMe(): Promise<User> {
    return apiFetch<User>("/auth/me", "get");
  },

  async verifyEmailToken(token: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/auth/verify-email?token=${token}`, "get");
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/auth/resend-verification", "post", { email });
  },
};
