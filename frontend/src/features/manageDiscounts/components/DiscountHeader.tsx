"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { DiscountHeaderProps } from "../types/discount.type";

export const DiscountHeader: React.FC<DiscountHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  activeTab,
  setActiveTab,
  statusFilter,
  setStatusFilter,
  canManage = true,
}) => {
  const statuses = ["All Status", "Active", "Scheduled", "Expired"];
  const tabs = ["All", "Direct Discounts", "Min Purchase", "B1G1"];

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
            Promotions & Discounts
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Manage all editorial price reductions, vouchers, and BOGO campaigns.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
            <input
              id="discount-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search discounts..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#ffffff] border shadow-xs text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow h-11"
            />
          </div>

          {canManage && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddClick}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap h-11"
            >
              <PlusIcon className="w-4 h-4" />
              New Discount
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="flex items-center gap-2 p-1 bg-[#eff1f2] rounded-xl w-fit overflow-x-auto no-scrollbar max-w-full border border-[#eff1f2]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-[#006666]"
                  : "text-[#595c5d] hover:text-[#2c2f30]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="hidden xl:block w-px h-6 bg-[#eff1f2]" />

        <div className="flex items-center gap-2 p-1 bg-[#eff1f2] rounded-xl w-fit overflow-x-auto no-scrollbar max-w-full border border-[#eff1f2]">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-white shadow-sm text-[#006666]"
                  : "text-[#595c5d] hover:text-[#2c2f30]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
