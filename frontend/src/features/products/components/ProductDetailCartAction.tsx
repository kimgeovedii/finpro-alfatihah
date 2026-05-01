"use client";

import { motion } from "framer-motion";
import {
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
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
            <span className="font-extrabold text-xl w-6 text-center text-slate-900">
              {qty}
            </span>
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

        <div className="mt-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full bg-linear-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20"
          >
            <ShoppingBagIcon className="w-6 h-6" />
            Add to Cart
          </motion.button>
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
          <div className="flex items-center justify-between bg-white rounded-full border border-slate-200/60 px-4 py-1">
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
            className="w-full py-3 px-6 mb-3 bg-emerald-800 text-white rounded-2xl font-bold text-lg flex justify-between items-center group shadow-lg shadow-emerald-800/10"
          >
            <span>Add to Cart</span>
            <ShoppingBagIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
