"use client";

import Link from "next/link";
import {
  MapPinIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavbar } from "@/hooks/useNavbar";

export const MainNavbar = () => {
  const {
    user,
    cartItems,
    searchTerm,
    setSearchTerm,
    onSearchSubmit,
    handleCartClick,
    handleLogout,
    isSearching,
    mounted,
    isAuthenticated,
    isVerified,
    locationName
  } = useNavbar();

  return (

    <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(23,29,27,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="block h-10 w-auto">
            <img
              alt="Alfatihah Logo"
              className="h-full w-auto object-contain"
              src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
            />
          </Link>
          <form onSubmit={onSearchSubmit} className="hidden md:flex relative w-64 lg:w-96 ml-8">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-sm rounded-full pl-5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-transparent focus:border-primary/50"
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1 disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
            <MapPinIcon className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {locationName || "Lokasi Dereng Aktif Lurd..."}
            </span>
          </div>
          
          {mounted && (
            <div className="flex items-center gap-5 text-primary dark:text-primary-container">
              {/* Cart button — disabled for unauth/unverified */}
              <button 
                className={`active:scale-95 transition-transform relative ${
                  !isAuthenticated() || !isVerified() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleCartClick}
                title={
                  !isAuthenticated() 
                    ? "Login untuk mengakses keranjang" 
                    : !isVerified() 
                    ? "Verifikasi email untuk mengakses keranjang"
                    : "Keranjang"
                }
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {isAuthenticated() && cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>

              {/* User menu */}
              {isAuthenticated() ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="active:scale-95 transition-transform">
                    <div className="flex items-center gap-2">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar.startsWith("http") ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`} 
                          alt="Avatar" 
                          className="h-7 w-7 rounded-full object-cover ring-2 ring-primary/20" 
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <span className="hidden md:block text-xs font-semibold text-primary truncate max-w-[100px]">
                        {user?.username || user?.email?.split("@")[0]}
                      </span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="active:scale-95 transition-transform text-gray-400 hover:text-red-500"
                    title="Logout"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/login"
                    className="text-xs font-semibold text-primary hover:text-primary-container transition-colors px-3 py-1.5 rounded-full hover:bg-primary/5"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="text-xs font-semibold text-white bg-primary hover:bg-primary-container px-4 py-1.5 rounded-full transition-colors active:scale-95"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
