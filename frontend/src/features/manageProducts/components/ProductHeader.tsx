"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProductHeaderProps } from "@/features/manageProducts/types/manageProduct.type";

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  categories,
  selectedCategory,
  onCategoryChange,
  canManage,
}) => {
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
            Products
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Manage your catalog, pricing, and inventory.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full md:w-72 pl-9 pr-4 py-2.5 rounded-xl bg-[#ffffff] border shadow-xs text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow h-11"
              />
            </div>

            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full md:w-40 px-4 py-2.5 rounded-xl bg-[#ffffff] border shadow-xs text-sm focus:ring-2 focus:ring-[#006666]/20 text-[#2c2f30] outline-none transition-shadow h-11 cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23595c5d' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {canManage && (
            <motion.button
              id="add-product-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddClick}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Product
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
