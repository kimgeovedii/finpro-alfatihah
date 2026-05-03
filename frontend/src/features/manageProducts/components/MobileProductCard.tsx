"use client";

import React from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MobileProductCardProps } from "@/features/manageProducts/types/manageProduct.type";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  index,
  onEdit,
  onDelete,
  canManage,
}) => {
  const primaryImage = product.productImages?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 flex gap-4"
    >
      <div className="w-16 h-16 rounded-lg bg-[#e6e8ea] overflow-hidden shrink-0">
        {primaryImage ? (
          <img
            alt={product.productName}
            src={primaryImage.imageUrl}
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
              {product.productName}
            </p>
            <p className="text-xs text-[#595c5d] truncate">{product.slugName}</p>
          </div>
          {canManage && (
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(product)}
                className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20"
                title="Edit product"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(product)}
                className="p-1.5 text-slate-400 hover:text-[#b31b25] transition-colors rounded-md hover:bg-red-50"
                title="Delete product"
              >
                <TrashIcon className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          {product.category?.name && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eff1f2] text-[#595c5d] text-xs">
              {product.category.name}
            </span>
          )}
          <span className="font-medium text-[#2c2f30] text-sm">
            {formatPrice(product.basePrice)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
