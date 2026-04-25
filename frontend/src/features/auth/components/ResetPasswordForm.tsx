"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  EnvelopeIcon, 
  ArrowLeftIcon,
  ArrowPathIcon,
  KeyIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "../hooks/useAuthService";
import { toast } from "sonner";
import { resetPasswordValidationSchema } from "../validations/auth.validation";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const { requestResetPassword, isLoading } = useAuthService();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        const result: any = await requestResetPassword(values.email);
        toast.success(result.message || "Tautan reset password telah dikirim!");
        // We can stay on page or redirect
      } catch (err: any) {
        toast.error(err.message || "Gagal memproses permintaan");
      }
    },
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-50 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-teal/5 rounded-full blur-3xl" />
      </div>

      <Link
        href="/login"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-2 transition-all hover:translate-x-[-4px] text-gray-500 font-semibold"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Kembali ke Login</span>
      </Link>

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div className="text-left mb-10 text-[#444]">
          <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm shadow-amber-200/50">
            <KeyIcon className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Lupa <span className="italic font-extrabold text-primary-teal">Password?</span>
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password Anda.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-gray-200/50">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email Anda</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@email.com"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-teal/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  <span>Mengirim...</span>
                </div>
              ) : (
                "Kirim Tautan Reset"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
