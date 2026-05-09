"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTableProps, CategoryTableRowProps } from "@/features/manageCategories/types/manageCategory.type";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export const CategoryTableRow: React.FC<CategoryTableRowProps> = ({
  category,
  index,
  onEdit,
  onDelete,
  canManage = true,
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="hover:bg-[#e6e8ea]/30 transition-colors group"
    >
      <td className="py-4 px-6">
        <div>
          <p className="font-medium text-[#2c2f30] text-sm">
            {category.name}
          </p>
          <p className="text-[#595c5d] text-xs">
            Slug: {category.slugName}
          </p>
        </div>
      </td>

      <td className="py-4 px-6 text-sm text-[#595c5d]">
        <div className="max-w-xs truncate" title={category.description}>
          {category.description || "—"}
        </div>
      </td>

      <td className="py-4 px-6 text-sm text-[#595c5d]">
        {category.createdAt ? new Date(category.createdAt).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) : "—"}
      </td>

      {canManage && (
        <td className="py-4 px-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onEdit(category)}
              className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20 cursor-pointer"
              title="Edit category"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDelete(category)}
              className="p-1.5 text-slate-400 hover:text-[#b31b25] transition-colors rounded-md hover:bg-red-50 cursor-pointer"
              title="Delete category"
            >
              <TrashIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  canManage = true,
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="w-3 h-3" />
    ) : (
      <ChevronDownIcon className="w-3 h-3" />
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th 
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort?.("name")}
              >
                <div className="flex items-center gap-1">
                  Category Name <SortIcon field="name" />
                </div>
              </th>
              <th className="py-4 px-6 font-medium">
                Description
              </th>
              <th className="py-4 px-6 font-medium">
                Created At
              </th>
              {canManage && (
                <th className="py-4 px-6 font-medium text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-[#f0f1f2] rounded w-32" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-[#f0f1f2] rounded w-48" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-[#f0f1f2] rounded w-24" /></td>
                  {canManage && <td className="py-4 px-6"><div className="h-4 bg-[#f0f1f2] rounded w-16 ml-auto" /></td>}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="py-12 text-center text-[#595c5d]">
                  <p className="text-lg font-medium">No categories found</p>
                  <p className="text-sm text-[#595c5d]/70">Try adding a new category to see it here.</p>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {categories.map((category, index) => (
                  <CategoryTableRow
                    key={category.id}
                    category={category}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canManage={canManage}
                  />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
