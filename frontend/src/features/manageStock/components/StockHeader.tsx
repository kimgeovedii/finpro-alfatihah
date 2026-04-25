"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon, BuildingStorefrontIcon, UserGroupIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
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
  branches,
  onAddClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2f30] tracking-tight font-(family-name:--font-heading,'Plus_Jakarta_Sans',sans-serif)]">
            Stock Management
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Monitor and adjust product inventory across branches.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Branch Selection */}
        <div className="w-full sm:w-56">
          <Select value={selectedBranchId} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full rounded-xl border-none bg-white shadow-sm text-[#2c2f30] h-10">
              <div className="flex items-center gap-2">
                <BuildingStorefrontIcon className="w-4 h-4 text-[#006666]" />
                <SelectValue placeholder="Select Branch" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#eff1f2]">
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.storeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
          <input
            id="stock-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border-none shadow-sm text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow"
          />
        </div>

        <motion.button
          id="add-stock-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-white text-sm font-medium shadow-md shadow-[#006666]/10 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          <PlusIcon className="w-4 h-4" />
          Update Stock
        </motion.button>
      </div>
    </motion.div>
  );
};
