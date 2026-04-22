"use client";

import React from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon, ClipboardDocumentListIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { StockTableRowProps } from "../types/manageStock.type";
import { Badge } from "@/components/ui/badge";

export const StockTableRow: React.FC<StockTableRowProps> = ({
  item,
  index,
  onUpdateStock,
  onViewJournal,
  simulationRole,
}) => {
  const product = item.product;
  const primaryImage = product?.productImages?.[0];

  const getStatus = (stock: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
    if (stock <= 5) return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  };

  const status = getStatus(item.currentStock);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="hover:bg-[#f5f6f7]/50 transition-colors group"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#e6e8ea] overflow-hidden shrink-0 border border-[#eff1f2]">
            {primaryImage ? (
              <img
                alt={product?.productName}
                src={primaryImage.imageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#595c5d]">
                <ChartBarIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#2c2f30] text-sm truncate">
              {product?.productName || "Unknown Product"}
            </p>
            <p className="text-[#595c5d] text-xs truncate">
              SKU: {product?.sku || item.productId.split("-")[0]}
            </p>
          </div>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#2c2f30]">{item.branch?.storeName || "Main Branch"}</span>
          <span className="text-[10px] text-[#595c5d]">{item.branch?.city || "Jakarta"}</span>
        </div>
      </td>

      <td className="py-4 px-6 font-mono font-medium text-[#2c2f30] text-sm">
        {item.currentStock}
      </td>

      <td className="py-4 px-6">
        <Badge variant="outline" className={`${status.color} font-medium px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider`}>
          {status.label}
        </Badge>
      </td>

      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onUpdateStock(item)}
            className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20 cursor-pointer"
            title="Update stock level"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onViewJournal(item)}
            className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20 cursor-pointer"
            title="View stock history"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};
