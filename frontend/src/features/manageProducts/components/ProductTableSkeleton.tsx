"use client";

import React from "react";
import { motion } from "framer-motion";

export const ProductTableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.tr
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 animate-pulse rounded" />
                <div className="w-20 h-3 bg-slate-100 animate-pulse rounded" />
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="w-16 h-4 bg-slate-200 animate-pulse rounded" />
          </td>
          <td className="py-4 px-6">
            <div className="w-20 h-4 bg-slate-200 animate-pulse rounded" />
          </td>
          <td className="py-4 px-6 text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="w-7 h-7 bg-slate-100 animate-pulse rounded-md" />
              <div className="w-7 h-7 bg-slate-100 animate-pulse rounded-md" />
            </div>
          </td>
        </motion.tr>
      ))}
    </>
  );
};
