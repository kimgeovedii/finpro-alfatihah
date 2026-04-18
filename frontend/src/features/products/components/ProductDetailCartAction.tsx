"use client";

import { motion } from "framer-motion";
import { PlusIcon, MinusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ProductDetailCartActionProps } from "@/features/products/types/product.type";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const ProductDetailCartAction = ({
  qty,
  setQty,
  price,
  totalPrice,
  variant,
}: ProductDetailCartActionProps) => {
  if (variant === "mobile") {
    // Mobile layout
    return (
      <>
        <div className="flex items-center justify-between gap-4 bg-slate-100 p-4 rounded-3xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <MinusIcon className="w-5 h-5 stroke-2" />
            </button>
            <span className="font-extrabold text-xl w-6 text-center text-slate-900">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
            </button>
          </div>
          <div className="flex-1 text-right whitespace-nowrap">
            <span className="text-slate-500 text-sm font-medium">Total:</span>
            <span className="text-slate-900 font-extrabold text-xl ml-2 tracking-tighter">
              {formatMoney(totalPrice)}
            </span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-4 bg-linear-to-t from-slate-50 via-slate-50 to-transparent pointer-events-none z-40">
          <div className="pointer-events-auto bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.1)]">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full bg-linear-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </>
    );
  }

  // Desktop layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-100/50 rounded-3xl p-8 shadow-[0px_32px_64px_rgba(0,0,0,0.04)] border border-slate-200/60"
    >
      <div className="mb-8">
        <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {formatMoney(price)}
        </span>
        <span className="text-slate-500 text-sm ml-1">/ piece</span>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">
            Select Quantity
          </label>
          <div className="flex items-center justify-between bg-white rounded-full border border-slate-200/60 px-4 py-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MinusIcon className="w-5 h-5 stroke-2" />
            </button>
            <span className="font-extrabold text-lg text-slate-900">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-slate-500 font-medium">Total</span>
            <span className="text-slate-900 font-extrabold text-xl tracking-tighter">
              {formatMoney(totalPrice)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 px-6 bg-emerald-800 text-white rounded-2xl font-bold text-lg flex justify-between items-center group shadow-lg shadow-emerald-800/10"
          >
            <span>Add to Cart</span>
            <ShoppingBagIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
        </div>

        <div className="pt-4 flex flex-col space-y-3">
          <div className="flex items-center text-xs text-slate-500">
            <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Standard delivery: 1-2 days</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Freshness Guarantee</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
