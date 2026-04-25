"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "../hooks/useAuthService";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { loginValidationSchema } from "../validations/auth.validation";

export const LoginForm = ({ isEmployee = false }: { isEmployee?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || (isEmployee ? "/dashboard" : "/");
  
  const { login, employeeLogin, googleLogin, isLoading, user } = useAuthService();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "EMPLOYEE") {
        router.push("/dashboard");
      } else {
        router.push(isEmployee ? "/dashboard" : redirect);
      }
    }
  }, [user, router, redirect, isEmployee]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isEmployee) {
          await employeeLogin(values);
        } else {
          await login(values);
        }
        toast.success("Login successful!");
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials");
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await googleLogin(credentialResponse.credential);
        toast.success("Login with Google successful!");
        router.push(redirect);
      } catch (err: any) {
        toast.error(err.message || "Google login failed");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-teal/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-teal/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
      >
        <img
          src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
          alt="Alfatihah Logo"
          className="h-8 md:h-12 w-auto object-contain"
        />
      </Link>

      {!isEmployee && (
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30 flex items-center gap-4">
          <p className="text-sm text-gray-500 hidden md:block font-medium">Belum punya akun?</p>
          <Link href="/register">
            <Button
              variant="outline"
              className="border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white rounded-full px-6 font-semibold transition-all duration-300"
            >
              Daftar
            </Button>
          </Link>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div className="text-left mb-10 text-[#444]">
          <p className="text-lg mb-1 font-medium text-primary-teal/80">Selamat Datang</p>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {isEmployee ? "Portal " : "Masuk ke "}
            <span className="italic font-extrabold text-primary-teal">
              {isEmployee ? "Employee" : "Akun"}
            </span> {isEmployee ? "" : "Anda"}
          </h1>
          <p className="text-gray-500 font-medium">
            {isEmployee 
              ? "Silakan masuk untuk mengelola toko Anda." 
              : "Silakan masukkan detail akun Anda di bawah ini."}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-gray-200/50 transition-all duration-500">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email Address</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`h-14 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-300 ${
                    formik.touched.email && formik.errors.email ? "border-red-300 ring-1 ring-red-300" : ""
                  }`}
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs ml-2 font-medium">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" title="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <Link href="/reset-password" title="forgot-password"  className="text-xs font-bold text-primary-teal hover:underline transition-all">
                  Lupa password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-14 pl-12 pr-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-300 ${
                    formik.touched.password && formik.errors.password ? "border-red-300 ring-1 ring-red-300" : ""
                  }`}
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs ml-2 font-medium">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-1">
              <Checkbox 
                id="rememberMe" 
                checked={formik.values.rememberMe}
                onCheckedChange={(checked) => formik.setFieldValue("rememberMe", checked)}
                className="border-gray-300 data-[state=checked]:bg-primary-teal data-[state=checked]:border-primary-teal rounded-md"
              />
              <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-500 cursor-pointer select-none">
                Ingat saya di perangkat ini
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-teal/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  <span>Sedang Masuk...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Masuk {isEmployee ? "Portal" : "Akun"}</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {!isEmployee && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Atau masuk dengan</span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed")}
                  useOneTap
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="384px"
                />
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Dengan masuk, Anda menyetujui <Link href="/terms" className="text-primary-teal hover:underline">Ketentuan Layanan</Link> dan <Link href="/privacy" className="text-primary-teal hover:underline">Kebijakan Privasi</Link> kami.
        </p>
      </div>
    </div>
  );
};
