"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductTableProps } from "@/features/manageProducts/types/manageProduct.type";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTableSkeleton } from "./ProductTableSkeleton";
import { ProductEmptyState } from "./ProductEmptyState";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  canManage,
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("productName")}
              >
                <div className="flex items-center gap-1">
                  Product <SortIcon field="productName" />
                </div>
              </th>
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("categoryId")}
              >
                <div className="flex items-center gap-1">
                  Category <SortIcon field="categoryId" />
                </div>
              </th>
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("basePrice")}
              >
                <div className="flex items-center gap-1">
                  Price <SortIcon field="basePrice" />
                </div>
              </th>
              {canManage && (
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {isLoading ? (
              <ProductTableSkeleton />
            ) : products.length === 0 ? (
              <ProductEmptyState />
            ) : (
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
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
    </motion.div>
  );
};
