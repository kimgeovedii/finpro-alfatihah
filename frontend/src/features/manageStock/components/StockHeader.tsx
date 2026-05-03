"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BuildingStorefrontIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { StockHeaderProps } from "../types/manageStock.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StockHeader: React.FC<StockHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedBranchId,
  onBranchChange,
  selectedStockStatus,
  onStatusChange,
  branches,
  onAddClick,
  isStoreAdmin,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2f30] tracking-tight font-(family-name:--font-heading,'Plus_Jakarta_Sans',sans-serif)]">
            Stock Management
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Monitor and adjust product inventory across branches.
          </p>
        </div>

        <motion.button
          id="add-stock-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-bold shadow-lg shadow-[#006666]/10 hover:opacity-95 transition-all cursor-pointer whitespace-nowrap h-11"
        >
          <PlusIcon className="w-4 h-4" />
          Update Stock
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748b]" />
          <input
            id="stock-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e2e8f0] shadow-sm text-sm focus:ring-2 focus:ring-[#006666]/10 focus:border-[#006666]/40 placeholder:text-[#94a3b8] text-[#2c2f30] outline-none transition-all h-11"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="w-full sm:w-48">
            <Select value={selectedStockStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full px-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm text-sm text-[#2c2f30] h-11 hover:border-[#cbd5e1] focus:ring-2 focus:ring-[#006666]/10 transition-all outline-none">
                <div className="flex items-center gap-2.5 truncate font-medium">
                  <FunnelIcon className="w-4.5 h-4.5 text-[#64748b]" />
                  <SelectValue placeholder="Stock Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#eff1f2] shadow-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem
                  value="in_stock"
                  className="text-green-600 font-medium"
                >
                  In Stock
                </SelectItem>
                <SelectItem
                  value="low_stock"
                  className="text-amber-600 font-medium"
                >
                  Low Stock (≤100)
                </SelectItem>
                <SelectItem
                  value="out_of_stock"
                  className="text-red-600 font-medium"
                >
                  Out of Stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-60">
            <Select
              value={selectedBranchId}
              onValueChange={onBranchChange}
              disabled={isStoreAdmin}
            >
              <SelectTrigger className="w-full px-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm text-sm text-[#2c2f30] h-11 hover:border-[#cbd5e1] focus:ring-2 focus:ring-[#006666]/10 transition-all outline-none disabled:opacity-80 disabled:bg-[#f8fafc]">
                <div className="flex items-center gap-2.5 truncate font-medium">
                  <BuildingStorefrontIcon className="w-4.5 h-4.5 text-[#64748b]" />
                  <SelectValue placeholder="All Branches" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#eff1f2] shadow-xl">
                {!isStoreAdmin && (
                  <SelectItem value="all">All Branches</SelectItem>
                )}
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
