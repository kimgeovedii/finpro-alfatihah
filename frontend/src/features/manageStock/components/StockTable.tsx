"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StockTableProps } from "../types/manageStock.type";
import { StockTableRow } from "./StockTableRow";
import { StockTableSkeleton } from "./StockTableSkeleton";
import { StockEmptyState } from "./StockEmptyState";

export const StockTable: React.FC<StockTableProps> = ({
  inventory,
  isLoading,
  onUpdateStock,
  onViewJournal,
  simulationRole,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#eff1f2] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f6f7] text-[#595c5d] text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Product info</th>
              <th className="py-4 px-6 font-semibold">Branch</th>
              <th className="py-4 px-6 font-semibold">Current Stock</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
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
                    simulationRole={simulationRole}
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
