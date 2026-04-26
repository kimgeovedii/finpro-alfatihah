"use client";

import React from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon, ClipboardDocumentListIcon, ChartBarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { BranchInventory } from "../types/manageStock.type";
import { Badge } from "@/components/ui/badge";

type MobileStockCardProps = {
  item: BranchInventory;
  index: number;
  onUpdateStock: (item: BranchInventory) => void;
  onViewJournal: (item: BranchInventory) => void;
};

export const MobileStockCard: React.FC<MobileStockCardProps> = ({
  item,
  index,
  onUpdateStock,
  onViewJournal,
}) => {
  const product = item.product;

  const getStatus = (stock: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
    if (stock <= 5) return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  };

  const status = getStatus(item.currentStock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-[#eff1f2] p-4 space-y-4"
    >
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="font-bold text-[#2c2f30] text-sm truncate">
                {product?.productName || "Unknown Product"}
              </p>
              <p className="text-[#595c5d] text-[10px] uppercase tracking-wider font-medium">
                SKU: {product?.sku || item.productId.split("-")[0]}
              </p>
            </div>
            <Badge variant="outline" className={`${status.color} font-bold px-2 py-0.5 rounded-md text-[9px] uppercase`}>
              {status.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 mt-1 text-[#595c5d]">
            <MapPinIcon className="w-3 h-3" />
            <span className="text-[11px] font-medium">{item.branch?.storeName || "Main Branch"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#eff1f2]">
        <div className="space-y-0.5">
          <p className="text-[10px] text-[#595c5d] font-medium uppercase font-mono">Current Stock</p>
          <p className="text-lg font-bold text-[#2c2f30]">{item.currentStock}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewJournal(item)}
            className="flex items-center gap-1.5 px-3 py-2 text-[#595c5d] bg-[#f5f6f7] hover:bg-[#e6e8ea] transition-colors rounded-lg text-xs font-medium"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            History
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStock(item)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#006666] text-white hover:bg-[#005959] transition-colors rounded-lg text-xs font-medium shadow-sm"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Update
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
