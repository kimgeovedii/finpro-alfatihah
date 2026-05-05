"use client";

import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CategoryHeaderProps } from "@/features/manageCategories/types/manageCategory.type";

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  canManage = true,
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2f30] tracking-tight font-[--font-heading,'Plus_Jakarta_Sans',sans-serif]">
            Inventory Categories
          </h2>
          <p className="text-sm text-[#595c5d] mt-1">
            Manage, curate, and organize your marketplace product taxonomies.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595c5d]" />
            <input
              id="category-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search categories..."
              className="w-full md:w-72 pl-9 pr-4 py-2.5 rounded-xl bg-[#ffffff] border shadow-xs text-sm focus:ring-2 focus:ring-[#006666]/20 placeholder:text-[#595c5d]/70 text-[#2c2f30] outline-none transition-shadow h-11"
            />
          </div>

          {canManage && (
            <motion.button
              id="add-category-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddClick}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap h-11"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Category
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
