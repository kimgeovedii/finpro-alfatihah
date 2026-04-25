"use client";

import { useState, useCallback, useMemo } from "react";
import { authService } from "../service/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types";

export const useAuthService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, clearAuth, user, setUser } = useAuthStore();

  const clearError = useCallback(() => setError(null), []);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.register(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmailToken = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.verifyAndSetPassword(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: any = await authService.login(data);
      setAuth(result.user, result.accessToken, result.refreshToken);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setAuth],);

  const employeeLogin = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: any = await authService.employeeLogin(data);
      setAuth(result.user, result.accessToken, result.refreshToken);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setAuth],);

  const googleLogin = useCallback(async (credential: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: any = await authService.googleLogin(credential);
      setAuth(result.user, result.accessToken, result.refreshToken);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  const requestResetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      return await authService.requestResetPassword(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmResetPassword = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      return await authService.confirmResetPassword(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      return await authService.resendVerification(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    // Don't fetch if no token exists in cookies
    if (typeof window !== "undefined") {
      const Cookies = (await import("js-cookie")).default;
      if (!Cookies.get("accessToken")) return null;
    }

    setIsLoading(true);
    try {
      const data = await authService.me() as User;
      setUser(data);
      return data;
    } catch (err: any) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const isAuthenticated = useCallback(() => !!user, [user]);
  const isVerified = useCallback(() => !!user?.emailVerifiedAt, [user]);

  return useMemo(() => ({
    register,
    verifyEmailToken,
    verifyAndSetPassword: verifyEmailToken,
    login,
    employeeLogin,
    googleLogin,
    logout,
    requestResetPassword,
    confirmResetPassword,
    resendVerification,
    isLoading,
    error,
    clearError,
    user,
    isAuthenticated,
    isVerified,
    cartItems: 0,
    fetchUser
  }), [
    register,
    verifyEmailToken,
    login,
    employeeLogin,
    googleLogin,
    logout,
    requestResetPassword,
    confirmResetPassword,
    resendVerification,
    isLoading,
    error,
    clearError,
    user,
    isAuthenticated,
    isVerified,
    fetchUser
  ]);
};
