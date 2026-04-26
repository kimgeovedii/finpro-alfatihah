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
          src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
          alt="Alfatihah Apps Logo"
          className="h-6 md:h-10 w-auto object-contain"
        />
      </Link>
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
