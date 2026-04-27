"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthService } from "../hooks/useAuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowPathIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { setPasswordValidationSchema } from "../validations/auth.validation";

type VerifyStatus = "loading" | "set-password" | "success" | "error" | "resend-ui" | "expired";

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type");

  const { verifyAndSetPassword, verifyEmailOnly, resendVerification, isLoading } = useAuthService();
  
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer cooldown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Automatic Verification for Email Change
  const handleVerifyEmailOnly = async (token: string) => {
    try {
      const result: any = await verifyEmailOnly(token);
      setStatus("success");
      setMessage(result.message || "Email berhasil diverifikasi!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Verifikasi email gagal.");
    }
  };

  // Determine initial state
  useEffect(() => {
    if (token) {
      if (type === "email-change") {
        handleVerifyEmailOnly(token);
      } else {
        // Token provided for registration: show password form
        setStatus("set-password");
        setMessage("");
      }
    } else if (email) {
      // Email provided: show resend verification UI
      setStatus("resend-ui");
      setMessage("Silakan periksa kotak masuk email Anda.");
    } else {
      setStatus("error");
      setMessage("Tautan tidak valid. Token atau email tidak ditemukan.");
    }
  }, [token, email, type]);

  // Password form (for registration only)
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setPasswordValidationSchema,
    onSubmit: async (values) => {
      if (!token) return;
      try {
        const result: any = await verifyAndSetPassword({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        setStatus("success");
        setMessage(result.message || "Email berhasil diverifikasi dan password telah dibuat!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        if (err.message?.includes("kedaluwarsa")) {
          setStatus("expired");
          setMessage(err.message);
        } else {
          setStatus("error");
          setMessage(err.message || "Verifikasi gagal. Silakan coba lagi.");
        }
      }
    },
  });

  const handleResend = async () => {
    const resendEmail = email || "";
    if (!resendEmail || cooldown > 0) return;
    setIsResending(true);
    try {
      await resendVerification(resendEmail);
      setMessage("Tautan verifikasi baru telah dikirimkan!");
      setCooldown(60); 
    } catch (err: any) {
      setMessage(err.message || "Gagal mengirim ulang email. Silakan coba lagi nanti.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[450px] px-6 py-10 md:py-12">
      {/* Header Text */}
      <div className="text-left mb-10 text-[#444]">
        <p className="text-lg mb-1 font-medium">Verifikasi</p>
        <h1 className="text-3xl font-bold mb-1 leading-tight">
          Email{" "}
          <span className="italic font-extrabold text-primary-teal">Akun</span>
        </h1>
        <p className="text-md font-medium opacity-80">
          {status === "set-password" 
            ? "Verifikasi email dan buat password untuk akun Anda."
            : status === "success" 
              ? "Email Anda telah berhasil diverifikasi."
              : "Satu langkah terakhir untuk menjaga keamanan akun Anda."}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 min-h-[300px] text-center transition-all duration-500">
        
        {/* LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <ArrowPathIcon className="h-16 w-16 animate-spin text-primary-teal opacity-20" />
              <ShieldCheckIcon className="h-8 w-8 text-primary-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">
              Memproses verifikasi...
            </p>
          </div>
        )}

        {/* SET PASSWORD FORM */}
        {status === "set-password" && (
          <div className="flex flex-col items-center gap-5 w-full animate-in fade-in duration-500">
            <div className="h-16 w-16 bg-teal-50 flex items-center justify-center rounded-full shadow-inner mb-2">
              <LockClosedIcon className="h-8 w-8 text-primary-teal" />
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-gray-800 font-bold text-lg">Buat Password Anda</p>
              <p className="text-sm text-gray-500">
                Buat password yang kuat untuk mengamankan akun Anda.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-600 ml-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Minimal 6 karakter"
                    className={`h-12 pr-12 bg-[#0000000D] backdrop-blur-md border-none rounded-[8px] focus-visible:ring-2 focus-visible:ring-primary-teal/40 focus-visible:bg-white transition-all duration-300 ${
                      formik.touched.password && formik.errors.password
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs ml-1 font-medium">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-600 ml-1">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Masukkan ulang password"
                    className={`h-12 pr-12 bg-[#0000000D] backdrop-blur-md border-none rounded-[8px] focus-visible:ring-2 focus-visible:ring-primary-teal/40 focus-visible:bg-white transition-all duration-300 ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs ml-1 font-medium">
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password requirements */}
              <div className="bg-gray-50 rounded-lg p-3 text-left">
                <p className="text-xs font-semibold text-gray-500 mb-1">Persyaratan password:</p>
                <ul className="text-xs text-gray-400 space-y-0.5">
                  <li className={formik.values.password.length >= 6 ? "text-emerald-600" : ""}>
                    ✓ Minimal 6 karakter
                  </li>
                  <li className={/[A-Z]/.test(formik.values.password) ? "text-emerald-600" : ""}>
                    ✓ Minimal 1 huruf besar
                  </li>
                  <li className={/[0-9]/.test(formik.values.password) ? "text-emerald-600" : ""}>
                    ✓ Minimal 1 angka
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading || formik.isSubmitting}
                className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-teal/20 transition-all duration-300 enabled:active:scale-[0.97] disabled:opacity-70"
              >
                {isLoading || formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  "Verifikasi & Buat Password"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="h-20 w-20 bg-emerald-50 flex items-center justify-center rounded-full shadow-inner">
              <ShieldCheckIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <p className="text-emerald-800 font-bold text-xl">{message}</p>
              <p className="text-sm text-gray-500">
                Mengarahkan Anda ke halaman login dalam 3 detik...
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-5 animate-in fade-in duration-500">
            <div className="h-20 w-20 bg-red-50 flex items-center justify-center rounded-full shadow-inner">
              <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-red-700 font-bold text-lg leading-tight">
              {message}
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all duration-300"
              onClick={() => router.push("/login")}
            >
              Kembali ke Login
            </Button>
          </div>
        )}

        {/* EXPIRED TOKEN */}
        {status === "expired" && (
          <div className="flex flex-col items-center gap-5 w-full animate-in fade-in duration-500">
            <div className="h-20 w-20 bg-amber-50 flex items-center justify-center rounded-full shadow-inner mb-2">
              <ExclamationCircleIcon className="h-10 w-10 text-amber-500" />
            </div>
            <div className="space-y-2">
              <p className="text-amber-800 font-bold text-lg">Token Kedaluwarsa</p>
              <p className="text-sm text-gray-500 px-4">
                {message}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 h-12 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white rounded-xl font-bold transition-all duration-300"
              onClick={() => router.push("/register")}
            >
              Daftar Ulang
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 font-semibold hover:bg-transparent hover:text-primary-teal transition-all"
              onClick={() => router.push("/login")}
            >
              Kembali ke Login
            </Button>
          </div>
        )}

        {/* RESEND UI */}
        {status === "resend-ui" && (
          <div className="flex flex-col items-center gap-5 w-full animate-in fade-in duration-500">
            <div className="h-20 w-20 bg-teal-50 flex items-center justify-center rounded-full shadow-inner mb-2">
              <EnvelopeIcon className="h-10 w-10 text-primary-teal" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 font-bold text-lg">{message}</p>
              <p className="text-sm text-gray-500 px-4">
                Belum menerima email? Periksa folder <b>Spam</b> atau minta
                tautan baru sekarang.
              </p>
            </div>

            <Button
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="w-full mt-6 h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-teal/20 transition-all duration-300 enabled:active:scale-[0.97] disabled:opacity-70"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  <span>Mengirim...</span>
                </div>
              ) : cooldown > 0 ? (
                `Kirim Ulang (${cooldown}s)`
              ) : (
                "Kirim Tautan Verifikasi Baru"
              )}
            </Button>

            <Button
              variant="ghost"
              className="text-gray-400 font-semibold mt-2 hover:bg-transparent hover:text-primary-teal transition-all"
              onClick={() => router.push("/login")}
            >
              Sudah verifikasi? Login di sini
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
