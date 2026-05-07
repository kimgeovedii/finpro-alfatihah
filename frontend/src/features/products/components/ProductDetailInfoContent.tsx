"use client";

import { motion } from "framer-motion";
import { ProductDetailInfoContentProps } from "@/features/products/types/product.type";
import { HeadingText } from "@/components/layout/HeadingText";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const ProductDetailInfoContent = ({
  productName,
  categoryName,
  description,
  price,
}: ProductDetailInfoContentProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <HeadingText level={1} children={productName}/>
          <p className="text-slate-500 font-medium mt-1 text-sm">
            Sold by weight • ~100g each
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-emerald-700 font-extrabold text-xl">
            {formatMoney(price)}
          </div>
          <div className="text-slate-500 text-xs font-medium uppercase">
            Per Piece
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block text-4xl xl:text-5xl font-black text-slate-900 tracking-tighter leading-tight"
      >
        {productName}
      </motion.h1>

      {/* Category label */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="h-[2px] w-6 bg-emerald-700"></div>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          {categoryName}
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm lg:text-base xl:text-lg text-slate-600 leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
};
