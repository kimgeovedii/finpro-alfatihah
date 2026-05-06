"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  MapIcon,
  XMarkIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  TicketIcon as TicketIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UserIcon as UserIconSolid,
  MapPinIcon as MapPinIconSolid,
} from "@heroicons/react/24/solid";
import { useNavbar } from "@/hooks/useNavbar";
import { useHomeStore } from "@/features/home/service/home.service";
import { addressService } from "@/features/profile/service/address.service";
import { useSearchStore } from "@/features/search/service/search.service";

export const MainNavbar = () => {
  const pathname = usePathname();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const { categories, fetchCategories } = useSearchStore();

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
  } = useNavbar();

  const {
    locationName,
    addresses,
    setAddresses,
    selectAddress,
    selectCurrentLocation,
    selectedLocationType,
    selectedAddressId,
  } = useHomeStore();

  // Fetch addresses and categories on mount
  useEffect(() => {
    if (mounted) {
      if (categories.length === 0) {
        fetchCategories();
      }
      if (isAuthenticated()) {
        addressService
          .getAddresses()
          .then((data) => setAddresses(Array.isArray(data) ? data : []))
          .catch(console.error);
      }
    }
  }, [
    mounted,
    isAuthenticated,
    setAddresses,
    fetchCategories,
    categories.length,
  ]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon, activeIcon: HomeIconSolid },
    {
      name: "Product",
      href: "/search",
      icon: TicketIcon,
      activeIcon: TicketIconSolid,
    },
    {
      name: "Transaction",
      href: "/transaction",
      icon: ClipboardDocumentListIcon,
      activeIcon: ClipboardDocumentListIconSolid,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
  ];

  const userMenuItems = [
    { name: "My Profile", href: "/profile", icon: UserIcon },
    {
      name: "Transaction",
      href: "/transaction",
      icon: ClipboardDocumentListIcon,
    },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <Link href="/" className="block h-8 md:h-10 w-auto shrink-0">
              <img
                alt="Alfatihah Logo"
                className="h-full w-auto object-contain"
                src="https://res.cloudinary.com/dvfywdxnt/image/upload/v1777146483/logo-apps_opuem6.png"
              />
            </Link>

            {/* Category Dropdown */}
            <div className="hidden lg:block relative" ref={categoryDropdownRef}>
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Squares2X2Icon className="h-5 w-5 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Categories
                </span>
                <ChevronDownIcon
                  className={`h-3 w-3 text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60]"
                  >
                    <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slugName}`}
                            onClick={() => setIsCategoryDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group"
                          >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                              {cat.name}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-slate-400 font-medium">
                            No categories found.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={onSearchSubmit}
              className="relative flex-1 max-w-md hidden sm:flex"
            >
              <input
                type="text"
                placeholder="All your daily needs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-sm rounded-2xl pl-5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Location Dropdown */}
            <div className="hidden lg:block relative" ref={locationDropdownRef}>
              <button
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group"
              >
                <MapPinIcon className="h-3.5 w-3.5 text-primary" />
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                    Dikirim Ke
                  </p>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px] block">
                    {locationName || "Set Lokasi..."}
                  </span>
                </div>
                <ChevronDownIcon
                  className={`h-3 w-3 text-slate-400 transition-transform ${isLocationDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60]"
                  >
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800">
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        Pilih Lokasi Pengiriman
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        Sesuaikan alamat agar kami bisa mencarikan cabang
                        terdekat.
                      </p>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                      {/* Current Location Option */}
                      <button
                        onClick={() => {
                          selectCurrentLocation();
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${selectedLocationType === "current" ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-600"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedLocationType === "current" ? "bg-primary/10" : "bg-slate-100"}`}
                        >
                          <MapIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">
                            Lokasi Saat Ini (GPS)
                          </p>
                          <p className="text-[10px] opacity-60">
                            Gunakan sensor GPS perangkat
                          </p>
                        </div>
                        {selectedLocationType === "current" && (
                          <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </button>

                      {/* Addresses List */}
                      {isAuthenticated() && addresses.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                          <p className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Alamat Tersimpan
                          </p>
                          {addresses.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() => {
                                selectAddress(addr.id);
                                setIsLocationDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${selectedAddressId === addr.id ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-600"}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? "bg-primary/10" : "bg-slate-100"}`}
                              >
                                <MapPinIconSolid className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold truncate">
                                    {addr.label}
                                  </p>
                                  {addr.isPrimary && (
                                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase">
                                      Utama
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] opacity-60 truncate">
                                  {addr.address}
                                </p>
                              </div>
                              {selectedAddressId === addr.id && (
                                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {!isAuthenticated() && (
                        <div className="p-4 text-center">
                          <p className="text-xs text-slate-400 font-medium">
                            Login untuk melihat alamat tersimpan Anda.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                      <Link
                        href="/profile"
                        onClick={() => setIsLocationDropdownOpen(false)}
                        className="w-full py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
                      >
                        Kelola Alamat
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mounted && (
              <div className="flex items-center gap-4 md:gap-5 text-slate-700 dark:text-slate-200">
                {/* Search Toggle Mobile Only */}
                <button
                  className="sm:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  onClick={() => {
                    setIsMobileSearchOpen((prev) => !prev);
                    setTimeout(
                      () => mobileSearchInputRef.current?.focus(),
                      150,
                    );
                  }}
                >
                  {isMobileSearchOpen ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  )}
                </button>

                {/* Cart button */}
                <button
                  className={`active:scale-95 transition-transform relative p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full ${
                    !isAuthenticated() || !isVerified()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleCartClick}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {isAuthenticated() && cartItems > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900">
                      {cartItems}
                    </span>
                  )}
                </button>

                {/* Desktop User Menu with Dropdown */}
                <div
                  className="hidden md:flex items-center gap-4"
                  ref={userDropdownRef}
                >
                  {isAuthenticated() ? (
                    <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() =>
                          setIsUserDropdownOpen(!isUserDropdownOpen)
                        }
                        className="group flex items-center gap-3 py-1 hover:opacity-80 transition-all"
                      >
                        {user?.avatar ? (
                          <img
                            src={
                              user.avatar.startsWith("http")
                                ? user.avatar
                                : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`
                            }
                            alt="Avatar"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary/40 transition-all"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="hidden lg:block text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            Account
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                              {user?.username || user?.email?.split("@")[0]}
                            </p>
                            <ChevronDownIcon
                              className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isUserDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60]"
                          >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Logged in as
                              </p>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {user?.email}
                              </p>
                            </div>

                            <div className="p-2">
                              {userMenuItems.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={() => setIsUserDropdownOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
                                >
                                  <item.icon className="h-4 w-4" />
                                  {item.name}
                                </Link>
                              ))}
                            </div>

                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50">
                              <button
                                onClick={() => {
                                  handleLogout();
                                  setIsUserDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                              >
                                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                                Logout Account
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                      <Link
                        href="/login"
                        className="text-xs font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-6 py-2 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Panel */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            ref={mobileSearchRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden sticky top-[57px] z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden"
          >
            <form
              onSubmit={(e) => {
                onSearchSubmit(e);
                setIsMobileSearchOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto"
            >
              <div className="relative flex-1">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="All your daily needs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-sm rounded-2xl pl-5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
              >
                Batal
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-90"
              >
                <div
                  className={`relative p-1 rounded-xl transition-all ${isActive ? "text-primary" : "text-slate-400"}`}
                >
                  <Icon className="h-6 w-6" />
                  {item.name === "Transaction" && isAuthenticated() && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight ${isActive ? "text-primary" : "text-slate-400"}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom nav to prevent content overlap */}
      <div className="md:hidden h-16" />
    </>
  );
};
