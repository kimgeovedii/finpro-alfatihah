"use client";

import Link from 'next/link';
import { ShieldExclamationIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useAuthService } from '@/features/auth/hooks/useAuthService';

export default function UnauthorizedPage() {
  const { user } = useAuthService();
  const returnUrl = user?.role === 'EMPLOYEE' ? '/dashboard' : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-full h-full bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shadow-inner">
              <ShieldExclamationIcon className="w-12 h-12 stroke-[1.5px]" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
            Access Denied
          </h1>
          <div className="h-1 w-12 bg-orange-400 rounded-full mb-4"></div>
          
          <h2 className="text-lg font-semibold text-slate-700 mb-3">
            Error 403 - Forbidden
          </h2>
          
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">
            You do not have the required permissions to view this page. This area is restricted based on your current account role.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Link 
              href={returnUrl}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-0.5"
            >
              <HomeIcon className="w-5 h-5 stroke-[2px]" />
              Return to Safety
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
