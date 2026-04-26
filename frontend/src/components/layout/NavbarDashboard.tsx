"use client";

import React from 'react';
import { 
  BellIcon, 
  ArrowRightStartOnRectangleIcon, 
  HomeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { useAuthService } from '@/features/auth/hooks/useAuthService';

export const Navbar = () => {
  const { user, logout } = useAuthService();
  const toggleMobileMenu = useSidebarStore((state) => state.toggleMobileMenu);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 flex h-20 md:h-24 w-full items-center justify-between bg-white px-4 md:px-8 shadow-sm">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2 md:gap-3 w-auto md:w-64 shrink-0">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-emerald-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img 
          src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png" 
          alt="LPP AGRO Nusantara Logo" 
          className="h-8 md:h-10 w-auto object-contain"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6 justify-end w-auto">
        <button className="relative rounded-xl p-2 text-slate-300 hover:text-emerald-600 transition-colors">
          <BellIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        <div className="flex items-center gap-3 md:gap-6 border-l border-slate-100 pl-4 md:pl-8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[#0a2e2e] leading-tight truncate max-w-[120px] lg:max-w-none">{user?.username || 'Admin'}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Admin</p>
          </div>
          
          <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-2 border-emerald-500 p-0.5 shadow-sm shrink-0">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=10b981&color=fff&bold=true`} 
              alt="Profile" 
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 md:gap-2 text-slate-400 hover:text-red-600 transition-all font-black text-[11px] uppercase tracking-[0.2em] group"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden lg:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
