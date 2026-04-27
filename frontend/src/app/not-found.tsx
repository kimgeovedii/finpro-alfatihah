"use client";

import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAuthService } from '@/features/auth/hooks/useAuthService';

export default function NotFound() {
  const { user } = useAuthService();
  const returnUrl = user?.role === 'EMPLOYEE' ? '/dashboard' : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <Link 
            href={returnUrl}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
          >
            <HomeIcon className="w-5 h-5 stroke-[2.5px]" />
            Return to Safety
          </Link>
        </div>
      </div>
    </div>
  );
}
