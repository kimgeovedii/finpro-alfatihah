"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PencilSquareIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
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
    if (stock <= 0)
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    if (stock <= 100)
      return {
        label: "Low Stock",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      };
    return {
      label: "In Stock",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  };

  const status = getStatus(item.currentStock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 flex gap-4"
    >
      <div className="w-16 h-16 rounded-lg bg-[#eff1f2] overflow-hidden shrink-0">
        {product?.productImages?.[0]?.imageUrl ? (
          <img
            alt={product.productName}
            src={product.productImages[0].imageUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#595c5d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v13.5A1.5 1.5 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-[#2c2f30] text-sm truncate">
              {product?.productName || "Unknown Product"}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-[#595c5d] uppercase tracking-wider font-medium">
                SKU: {product?.sku || item.productId.split("-")[0]}
              </p>
              <Badge
                variant="outline"
                className={`${status.color} font-bold px-1.5 py-0 rounded-md text-[8px] uppercase border-none`}
              >
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateStock(item)}
              className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20"
              title="Update stock"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewJournal(item)}
              className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20"
              title="View history"
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#eff1f2]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#595c5d]">
              <MapPinIcon className="w-3 h-3" />
              <span className="text-[10px] font-medium">
                {item.branch?.storeName || "Main Branch"}
              </span>
            </div>
            <div className="h-3 w-1px bg-[#eff1f2]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#595c5d] font-medium uppercase font-mono">
                Stock
              </span>
              <span className="text-sm font-bold text-[#2c2f30]">
                {item.currentStock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
