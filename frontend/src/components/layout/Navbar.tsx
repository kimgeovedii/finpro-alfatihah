"use client"

import React, { useState } from 'react'
import { useUser } from '@/features/auth/hooks/useUser'
import { useAuthService } from '@/features/auth/service/auth.service'
import { useRouter } from 'next/navigation'
import { BellIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'

export const Navbar = () => {
  const { user, isLoading } = useUser()
  const { logout } = useAuthService()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-6">
        
        <div className="flex items-center gap-4 text-emerald-800 font-semibold text-lg hidden md:block">
          Welcome back
        </div>

        <div className="flex flex-1 items-center justify-end gap-5">
          <button className="relative p-2 text-slate-500 hover:bg-emerald-50 rounded-full transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:bg-white/50 hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-end hidden md:flex">
                 {isLoading ? (
                    <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
                 ) : (
                    <span className="text-sm font-bold text-slate-800 tracking-tight">{user?.name || "User"}</span>
                 )}
                {isLoading ? (
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mt-1"></div>
                 ) : (
                    <span className="text-xs font-medium text-emerald-600">{user?.role?.name || "Guest"}</span>
                 )}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </button>

            {showDropdown && (
              <>
                 <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-20 py-1">
                    <button 
                       onClick={handleLogout}
                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                    >
                       <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                       Logout
                    </button>
                 </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
