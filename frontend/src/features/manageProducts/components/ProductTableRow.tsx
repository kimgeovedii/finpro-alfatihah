"use client";

import React from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ProductTableRowProps } from "@/features/manageProducts/types/manageProduct.type";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  index,
  onEdit,
  onDelete,
  canManage,
}) => {
  const primaryImage = product.productImages?.[0];

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="hover:bg-[#e6e8ea]/30 transition-colors group"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#e6e8ea] overflow-hidden shrink-0">
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
                  className="w-6 h-6"
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
          <div>
            <p className="font-medium text-[#2c2f30] text-sm">
              {product.productName}
            </p>
            <p className="text-[#595c5d] text-xs">
              SKU: {product.sku ?? product.slugName}
            </p>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 text-sm text-[#595c5d]">
        {product.category?.name || "—"}
      </td>
      <td className="py-4 px-6 font-medium text-[#2c2f30] text-sm">
        {formatPrice(product.basePrice)}
      </td>

      {canManage && (
        <td className="py-4 px-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onEdit(product)}
              className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20 cursor-pointer"
              title="Edit product"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDelete(product)}
              className="p-1.5 text-slate-400 hover:text-[#b31b25] transition-colors rounded-md hover:bg-red-50 cursor-pointer"
              title="Delete product"
            >
              <TrashIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};
