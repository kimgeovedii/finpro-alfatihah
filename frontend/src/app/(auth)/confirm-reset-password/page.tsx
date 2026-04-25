import React, { Suspense } from "react";
import { ConfirmResetPasswordForm } from "@/features/auth/components/ConfirmResetPasswordForm";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ConfirmResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-teal/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
           <ArrowPathIcon className="h-10 w-10 animate-spin text-primary-teal" />
           <p className="text-gray-400 font-medium">Memuat halaman...</p>
        </div>
      }>
        <ConfirmResetPasswordForm />
      </Suspense>
    </div>
  );
}
