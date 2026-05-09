"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StockTableProps } from "../types/manageStock.type";
import { StockTableRow } from "./StockTableRow";
import { StockTableSkeleton } from "./StockTableSkeleton";
import { StockEmptyState } from "./StockEmptyState";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

export const StockTable: React.FC<StockTableProps> = ({
  inventory,
  isLoading,
  onUpdateStock,
  onViewJournal,
  isStoreAdmin,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
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
      className="w-full overflow-x-auto"
    >
      <div className="min-w-[800px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th 
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors group"
                onClick={() => onSort?.("productName")}
              >
                <div className="flex items-center gap-1">
                  Product
                  {renderSortIcon("productName")}
                </div>
              </th>
              {!isStoreAdmin && (
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors group"
                  onClick={() => onSort?.("branch")}
                >
                  <div className="flex items-center gap-1">
                    Branch
                    {renderSortIcon("branch")}
                  </div>
                </th>
              )}
              <th 
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors group"
                onClick={() => onSort?.("currentStock")}
              >
                <div className="flex items-center gap-1">
                  Current Stock
                  {renderSortIcon("currentStock")}
                </div>
              </th>
              <th 
                className="py-4 px-6 font-medium text-center cursor-pointer hover:text-[#006666] transition-colors group"
                onClick={() => onSort?.("currentStock")}
              >
                <div className="flex items-center justify-center gap-1">
                  Status
                  {renderSortIcon("currentStock")}
                </div>
              </th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {isLoading ? (
              <StockTableSkeleton />
            ) : inventory.length === 0 ? (
              <StockEmptyState />
            ) : (
              <AnimatePresence mode="popLayout">
                {inventory.map((item, index) => (
                  <StockTableRow
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdateStock={onUpdateStock}
                    onViewJournal={onViewJournal}
                    isStoreAdmin={isStoreAdmin}
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
