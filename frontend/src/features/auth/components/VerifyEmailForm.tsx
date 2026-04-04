"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck, AlertCircle, ShieldCheck } from "lucide-react";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export const VerifyEmailForm = () => {
  const { status, message, cooldown, isResending, handleResend, router } = useVerifyEmail();

  return (
    <div className="relative z-10 w-full max-w-[450px] px-6 py-10 md:py-12">
      {/* Header Text - Matching Login Hierarchy */}
      <div className="text-left mb-10 text-[#444]">
        <p className="text-lg mb-1 font-medium">Verifikasi</p>
        <h1 className="text-3xl font-bold mb-1 leading-tight">
          Email <span className="italic font-extrabold text-primary-teal">Akun</span>
        </h1>
        <p className="text-md font-medium opacity-80">Satu langkah terakhir untuk menjaga keamanan akun Anda.</p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 min-h-[300px] text-center transition-all duration-500">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary-teal opacity-20" />
              <ShieldCheck className="h-8 w-8 text-primary-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">Memverifikasi profil Anda...</p>
            <p className="text-sm text-gray-400">Mohon tunggu sebentar sementara kami memvalidasi token.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="h-20 w-20 bg-emerald-50 flex items-center justify-center rounded-full shadow-inner">
              <MailCheck className="h-10 w-10 text-success-green" />
            </div>
            <div className="space-y-1">
               <p className="text-emerald-800 font-bold text-xl">{message}</p>
               <p className="text-sm text-gray-500">Mengarahkan Anda ke halaman login dalam 3 detik...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-5 animate-in shake duration-500">
            <div className="h-20 w-20 bg-red-50 flex items-center justify-center rounded-full shadow-inner">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-red-700 font-bold text-lg leading-tight">{message}</p>
            <Button 
              variant="outline" 
              className="mt-4 w-full h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all duration-300"
              onClick={() => router.push("/login")}
            >
              Kembali ke Login
            </Button>
          </div>
        )}

        {status === "resend-ui" && (
          <div className="flex flex-col items-center gap-5 w-full animate-in fade-in duration-500">
            <div className="h-20 w-20 bg-teal-50 flex items-center justify-center rounded-full shadow-inner mb-2">
              <MailCheck className="h-10 w-10 text-primary-teal" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 font-bold text-lg">{message}</p>
              <p className="text-sm text-gray-500 px-4">
                Belum menerima email? Periksa folder <b>Spam</b> atau minta tautan baru sekarang.
              </p>
            </div>
            
            <Button
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="w-full mt-6 h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-teal/20 transition-all duration-300 enabled:active:scale-[0.97] disabled:opacity-70"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
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
