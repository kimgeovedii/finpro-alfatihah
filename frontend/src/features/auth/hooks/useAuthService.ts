"use client";

import { useState, useCallback, useMemo } from "react";
import { authService } from "../service/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types";
import { getDeviceId } from "@/utils/deviceId";

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

  const verifyEmailOnly = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.verifyEmailOnly(token);
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
      const deviceId = getDeviceId();
      const result: any = await authService.login({ ...data, deviceId });
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
      const deviceId = getDeviceId();
      const result: any = await authService.employeeLogin({ ...data, deviceId });
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
      const deviceId = getDeviceId();
      const result: any = await authService.googleLogin({ credential, deviceId });
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
      const isEmployee = user?.role === 'EMPLOYEE' || user?.role === 'SUPER_ADMIN' || user?.role === 'STORE_ADMIN';
      await authService.logout(isEmployee);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, user]);

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
      if (!Cookies.get("accessToken")) {
        clearAuth();
        return null;
      }
    }

    setIsLoading(true);
    try {
      const data = await authService.me() as User;
      setUser(data);
      return data;
    } catch (err: any) {
      if (err.message?.includes("token") || err.status === 401) {
        clearAuth();
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, clearAuth]);

  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") return !!user;
    const Cookies = require("js-cookie");
    return !!user && !!Cookies.get("accessToken");
  }, [user]);
  const isVerified = useCallback(() => !!user?.emailVerifiedAt, [user]);

  return useMemo(() => ({
    register,
    verifyEmailToken,
    verifyAndSetPassword: verifyEmailToken,
    verifyEmailOnly,
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
    verifyEmailOnly,
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
