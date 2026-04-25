"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "../hooks/useAuthService";
import { toast } from "sonner";
import { confirmResetPasswordValidationSchema } from "../validations/auth.validation";

export const ConfirmResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { confirmResetPassword, isLoading } = useAuthService();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: confirmResetPasswordValidationSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Token reset tidak valid");
        return;
      }
      try {
        await confirmResetPassword({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        setIsSuccess(true);
        toast.success("Password berhasil diubah!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        toast.error(err.message || "Gagal mengubah password");
      }
    },
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500">
           <LockClosedIcon className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tautan Tidak Valid</h2>
        <p className="text-gray-500 max-w-xs">Token reset password tidak ditemukan atau sudah tidak berlaku.</p>
        <Button 
          className="mt-6 bg-primary-teal hover:bg-[#00767a]" 
          onClick={() => router.push("/reset-password")}
        >
          Minta Tautan Baru
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 animate-in fade-in duration-500">
        <div className="bg-emerald-50 p-6 rounded-full mb-6 text-emerald-500 shadow-inner">
           <CheckCircleIcon className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Password Berhasil Diubah!</h2>
        <p className="text-gray-500 mb-8">Password Anda telah berhasil diperbarui. Silakan masuk menggunakan password baru Anda.</p>
        <div className="flex items-center gap-2 text-primary-teal font-bold animate-pulse">
          <ArrowPathIcon className="h-5 w-5 animate-spin" />
          <span>Mengarahkan ke halaman login...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
      <div className="text-left mb-10 text-[#444]">
        <p className="text-lg mb-1 font-medium text-primary-teal/80">Atur Ulang</p>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Buat <span className="italic font-extrabold text-primary-teal">Password Baru</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Masukkan password baru Anda di bawah ini.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-gray-200/50">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="password" title="password" className="text-sm font-semibold text-gray-700 ml-1">Password Baru</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
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

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" title="confirm-password" className="text-sm font-semibold text-gray-700 ml-1">Konfirmasi Password Baru</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan ulang password"
                className={`h-14 pl-12 pr-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-300 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-300 ring-1 ring-red-300" : ""
                }`}
                {...formik.getFieldProps("confirmPassword")}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs ml-2 font-medium">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-teal/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <ArrowPathIcon className="h-6 w-6 animate-spin" />
                <span>Memproses...</span>
              </div>
            ) : (
              "Simpan Password Baru"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
