"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

interface DiscountHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DiscountHeader: React.FC<DiscountHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  activeTab,
  setActiveTab,
}) => {
  const tabs = ["All", "Direct Discounts", "Min Purchase", "B1G1"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-6"
    >
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">
          Promotions & Discounts
        </h1>
        <p className="text-slate-500 mt-1">
          Manage all editorial price reductions, vouchers, and BOGO campaigns
          across the platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full w-fit overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-teal-800"
                  : "text-slate-500 hover:text-teal-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
            <input
              id="discount-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search discounts..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#e0e3e4] border-none text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Create New Discount
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
