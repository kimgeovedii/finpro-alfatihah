"use client";

import React from 'react';
import { 
  BellIcon, 
  ArrowRightStartOnRectangleIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuthService } from '@/features/auth/hooks/useAuthService';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user, logout } = useAuthService();
  const router = useRouter();
  console.log(user);

  const handleLogout = async () => {
    // Check role before logging out because logout() clears the user state
    const isEmployee = user?.role === 'EMPLOYEE' || user?.role === 'SUPER_ADMIN' || user?.role === 'STORE_ADMIN';
    
    await logout();
    router.push(isEmployee ? '/employee/login' : '/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
      {/* Search Bar */}
      <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 md:flex">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search products, orders, etc..." 
          className="w-full bg-transparent text-sm font-medium text-slate-600 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-50 hover:text-emerald-600 active:scale-95">
          <BellIcon className="h-6 w-6" />
          <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-100"></div>

        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{user?.username || 'User'}</p>
              <p className="text-xs font-medium text-slate-400 capitalize">{user?.role || 'Customer'}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-slate-100 p-0.5 ring-2 ring-transparent transition-all group-hover:ring-emerald-500/20 shadow-sm overflow-hidden">
              <img 
                src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.username || "User")} 
                alt="Profile" 
                className="h-full w-full rounded-[14px] object-cover"
              />
            </div>
          </Link>

          <button 
            onClick={handleLogout}
            className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95"
            title="Logout"
          >
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
