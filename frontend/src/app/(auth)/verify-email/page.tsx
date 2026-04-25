import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden ">
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-4 transition-all cursor-pointer"
      >
        <img
          src="/assets/logo-apps.png"
          alt="Alfatihah Apps Logo"
          className="h-6 md:h-10 w-auto object-contain"
        />
      </Link>

      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30 flex items-center gap-4 transition-all">
        <p className="text-sm text-gray-500 hidden md:block font-medium">
          {" "}
          Belum punya akun?{" "}
        </p>
        <Link href="/register">
          <Button
            variant="outline"
            className="border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white rounded-full px-6 font-semibold transition-all duration-300"
          >
            Daftar
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <ArrowPathIcon className="h-10 w-10 animate-spin text-primary-teal" />
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
