"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { AccountHeaderProps, RoleFilter } from "../types/manageAccount.type";

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "ALL", label: "All Users" },
  { value: "CUSTOMER", label: "Customers" },
  { value: "EMPLOYEE", label: "All Employees" },
  { value: "STORE_ADMIN", label: "Store Admins" },
  { value: "SUPER_ADMIN", label: "Super Admins" },
];

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onAddClick,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = ROLE_OPTIONS.find((o) => o.value === roleFilter)?.label ?? "All Users";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2f30] tracking-tight font-(family-name:--font-heading,'Plus_Jakarta_Sans',sans-serif)]">
            Account Management
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Manage and oversee platform administrators and registered users.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
            <input
              id="account-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search accounts..."
              className="w-full md:w-72 pl-9 pr-4 py-2.5 rounded-xl bg-white border shadow-xs text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow h-11"
            />
          </div>

          {/* Role filter dropdown */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-48 px-4 py-2.5 rounded-xl bg-white border border-[#e2e8f0] shadow-sm text-sm text-[#2c2f30] flex items-center justify-between gap-2 hover:border-[#cbd5e1] transition-all h-11 cursor-pointer focus:ring-2 focus:ring-[#006666]/10 outline-none"
            >
              <div className="flex items-center gap-2 truncate">
                <FunnelIcon className="w-4 h-4 text-[#64748b]" />
                <span className="truncate">{selectedLabel}</span>
              </div>
              <motion.svg
                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#64748b"
                className="w-4 h-4 shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute z-50 left-0 right-0 md:left-auto md:w-52 mt-1 bg-white rounded-xl shadow-xl border border-[#e2e8f0] overflow-hidden py-1"
                >
                  {ROLE_OPTIONS.map((option, i) => (
                    <React.Fragment key={option.value}>
                      {i === 2 && <div className="h-px bg-[#f1f5f9] mx-2 my-1" />}
                      <button
                        onClick={() => {
                          onRoleFilterChange(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#f8fafc] ${
                          roleFilter === option.value
                            ? "text-[#006666] font-semibold bg-[#f0fdfa]"
                            : "text-[#475569]"
                        }`}
                      >
                        {option.label}
                      </button>
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add button */}
          <motion.button
            id="add-account-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Add Store Admin
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
