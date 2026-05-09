"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border border-red-50">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-red-500">
            <ExclamationTriangleIcon className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Something went wrong!
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed px-4">
            We apologize for the inconvenience. An unexpected error occurred while processing your request.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-0.5"
          >
            <ArrowPathIcon className="w-5 h-5 stroke-[2.5px]" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
