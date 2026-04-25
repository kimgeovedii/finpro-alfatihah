import React, { Suspense } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function EmployeeLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <ArrowPathIcon className="h-10 w-10 animate-spin text-primary-teal" />
        </div>
      }
    >
      <LoginForm isEmployee={true} />
    </Suspense>
  );
}
