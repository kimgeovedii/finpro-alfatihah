"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProductHeaderProps } from "@/features/manageProducts/types/manageProduct.type";

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2f30] tracking-tight font-(family-name:--font-heading,'Plus_Jakarta_Sans',sans-serif)]">
          Products
        </h2>
        <p className="text-sm text-[#595c5d] mt-1">
          Manage your catalog, pricing, and inventory.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
          <input
            id="product-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#e0e3e4] border-none text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow"
          />
        </div>

        <motion.button
          id="add-product-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Product
        </motion.button>
      </div>
    </motion.div>
  );
};
