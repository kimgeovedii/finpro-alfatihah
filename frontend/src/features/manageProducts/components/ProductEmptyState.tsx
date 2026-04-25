"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

export const ProductEmptyState: React.FC = () => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <td colSpan={4} className="py-16 px-6">
        <div className="flex flex-col items-center justify-center text-center text-[#595c5d]">
          <div className="w-16 h-16 bg-[#87eded]/20 rounded-full flex items-center justify-center mb-4 text-[#006666]">
            <ArchiveBoxXMarkIcon className="w-8 h-8" />
          </div>
          <p className="font-medium text-[#2c2f30]">No products found</p>
          <p className="text-sm mt-1 max-w-xs">
            Try adjusting your search or add a new product to get started.
          </p>
        </div>
      </td>
    </motion.tr>
  );
};
