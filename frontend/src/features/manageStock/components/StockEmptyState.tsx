"use client";

import React from "react";
import { motion } from "framer-motion";
import { InboxIcon } from "@heroicons/react/24/outline";

export const StockEmptyState: React.FC = () => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <td colSpan={5} className="py-24 px-6">
        <div className="flex flex-col items-center justify-center text-center text-[#595c5d]">
          <div className="w-16 h-16 bg-[#006666]/10 rounded-full flex items-center justify-center mb-4 text-[#006666]">
            <InboxIcon className="w-8 h-8" />
          </div>
          <p className="font-semibold text-[#2c2f30] text-lg">No stock data found</p>
          <p className="text-sm mt-1 max-w-xs text-[#595c5d]">
            We couldn't find any inventory records matching your criteria. Try adjusting your filters.
          </p>
        </div>
      </td>
    </motion.tr>
  );
};
