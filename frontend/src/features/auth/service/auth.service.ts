import { create } from "zustand";
import Cookies from "js-cookie";
import { authRepository } from "../repository/auth.repository";
import { LoginPayload, LoginResponse } from "../types";
import { AuthState } from "../types";

export const useAuthService = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authRepository.login(payload);

      const cookieOptions: Cookies.CookieAttributes = {
        sameSite: "strict",
        expires: 1,
        ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
      };

      Cookies.set("accessToken", response.accessToken, {
        path: "/",
        ...cookieOptions,
        expires: payload.rememberMe ? 30 : 1, 
      }); 
      Cookies.set("refreshToken", response.refreshToken, {
        path: "/",
        ...cookieOptions,
        expires: payload.rememberMe ? 30 : 1,
      }); 

      console.debug(
        "set tokens",
        Cookies.get("accessToken"),
        Cookies.get("refreshToken"),
      );

      set({
        user: response.user,
        accessToken: response.accessToken,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Login failed",
        isLoading: false,
      });
      throw err;
    }
  },

  fetchUser: async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await authRepository.getMe();
      set({ user: response, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch user data",
        isLoading: false,
        user: null,
      });
    }
  },

  resendVerification: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authRepository.resendVerification(email);
      set({ isLoading: false });
      return response;
    } catch (err: any) {
      set({
        error: err.message || "Failed to resend verification email",
        isLoading: false,
      });
      throw err;
    }
  },

  verifyEmailToken: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authRepository.verifyEmailToken(token);
      set({ isLoading: false });
      return response;
    } catch (err: any) {
      set({
        error: err.message || "Failed to verify email",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        await authRepository.logout(refreshToken);
      }
    } catch (error) {
      console.error("Server-side logout failed:", error);
    } finally {
      // Always clear local state regardless of server response
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      set({ user: null, accessToken: null, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
