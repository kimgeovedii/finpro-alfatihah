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
  ArrowRightIcon,
  ArrowPathIcon,
  SparklesIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "../hooks/useAuthService";
import { toast } from "sonner";
import { registerValidationSchema } from "../validations/auth.validation";

export const RegisterForm = () => {
  const router = useRouter();
  const { register, isLoading } = useAuthService();

  const formik = useFormik({
    initialValues: {
      email: "",
      referralCode: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        const result: any = await register(values);
        toast.success(result.message || "Email verifikasi telah dikirim!");
        // Redirect to a check-email page or show success state
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } catch (err: any) {
        toast.error(err.message || "Pendaftaran gagal");
      }
    },
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-teal-50/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-4 transition-all hover:scale-105"
      >
        <img
          src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
          alt="Alfatihah Logo"
          className="h-8 md:h-12 w-auto object-contain"
        />
      </Link>

      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30 flex items-center gap-4">
        <p className="text-sm text-gray-500 hidden md:block font-medium">Sudah punya akun?</p>
        <Link href="/login">
          <Button
            variant="outline"
            className="border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white rounded-full px-6 font-semibold transition-all duration-300"
          >
            Masuk
          </Button>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div className="text-left mb-10 text-[#444]">
          <div className="flex items-center gap-2 mb-2">
             <SparklesIcon className="h-6 w-6 text-primary-teal animate-bounce" />
             <p className="text-lg font-medium text-primary-teal/80">Mari Bergabung</p>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Buat Akun <span className="italic font-extrabold text-primary-teal">Baru</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Masukkan email Anda untuk memulai perjalanan belanja Anda.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-gray-200/50 transition-all duration-500">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email Address</Label>
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

            <div className="space-y-3">
              <Label htmlFor="referralCode" className="text-sm font-semibold text-gray-700 ml-1">Referral Code (Opsional)</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-teal">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Contoh: REF-123456"
                  className="h-14 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-300"
                  {...formik.getFieldProps("referralCode")}
                />
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                <span className="font-bold">Info:</span> Kami akan mengirimkan tautan verifikasi ke email Anda. Anda dapat membuat password setelah memverifikasi email tersebut.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-teal/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  <span>Sedang Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Daftar Sekarang</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Sudah punya akun? <Link href="/login" className="text-primary-teal font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};
