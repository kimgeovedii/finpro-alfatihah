"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { ProductDetailCartActionProps } from "@/features/products/types/product.type";
import { ProductAddedInfoCard } from "./ProductAddedInfoCard";
import { ProductRemoveButton } from "./ProductRemoveButton";

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
  discountedPrice,
  totalPrice,
  variant,
  onAddToCart,
  onRemoveFromCart,
  isCreating,
  currentCartQty,
  disabled,
  role,
}: ProductDetailCartActionProps) => {
  const router = useRouter();

  const handleCartAction = () => {
    if (role === "GUEST") {
      router.push("/login");
      return;
    }

    onAddToCart();
  };

  if (variant === "mobile") {
    // Mobile layout
    return (
      <>
        {currentCartQty ? (
          <ProductAddedInfoCard currentCartQty={currentCartQty} />
        ) : (
          <></>
        )}
        <div
          className={`flex items-center justify-between gap-4 bg-slate-100 p-4 rounded-3xl ${disabled ? "opacity-60 pointer-events-none" : ""}`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={role === "CUSTOMER" ? disabled : true}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <MinusIcon className="w-5 h-5 stroke-2" />
            </button>
            <span
              className={`font-extrabold text-xl w-6 text-center ${role === "CUSTOMER" ? "text-slate-900" : "text-gray-400"}`}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              disabled={role === "CUSTOMER" ? disabled : true}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm hover:bg-emerald-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
            </button>
          </div>
          {role === "CUSTOMER" && (
            <div className="flex-1 text-right whitespace-nowrap">
              <span className="text-slate-500 text-sm font-medium">Total:</span>
              <span className="text-slate-900 font-extrabold text-xl ml-2 tracking-tighter">
                {formatMoney(totalPrice)}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white/80 p-2 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-slate-100">
            <div
              className={`flex ${currentCartQty ? "flex-row gap-2" : "flex-col"}`}
            >
              <motion.button
                whileTap={!disabled ? { scale: 0.96 } : {}}
                onClick={handleCartAction}
                disabled={isCreating || disabled}
                className="w-full bg-linear-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingBagIcon className="w-6 h-6" />
                )}
                {isCreating
                  ? "Adding..."
                  : disabled
                    ? "Not Available"
                    : currentCartQty
                      ? "Add More?"
                      : "Add to Cart"}
              </motion.button>
              {currentCartQty ? (
                <ProductRemoveButton
                  onRemoveFromCart={onRemoveFromCart}
                  isLoading={isCreating}
                />
              ) : (
                <></>
              )}
            </div>
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
      {currentCartQty ? (
        <ProductAddedInfoCard currentCartQty={currentCartQty} />
      ) : (
        <></>
      )}
      <div className={role === "CUSTOMER" ? "mb-8" : ""}>
        {discountedPrice ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {formatMoney(discountedPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-lg font-bold line-through">
                {formatMoney(price)}
              </span>
              <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-100">
                {Math.round(((price - discountedPrice) / price) * 100)}% OFF
              </span>
            </div>
          </div>
        ) : (
          <>
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {formatMoney(price)}
            </span>
          </>
        )}
      </div>
      <div className="space-y-8">
        <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">
            Select Quantity
          </label>
          <div className="flex items-center justify-between bg-white rounded-full border border-slate-200/60 px-4 py-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={role === "CUSTOMER" ? disabled : true}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <MinusIcon className="w-5 h-5 stroke-2" />
            </button>
            <span
              className={`font-extrabold text-lg ${role === "CUSTOMER" ? "text-slate-900" : "text-gray-400"}`}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              disabled={role === "CUSTOMER" ? disabled : true}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
            </button>
          </div>
        </div>
        <div className="pt-2">
          {role === "CUSTOMER" && (
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-slate-500 font-medium">Total</span>
              <span className="text-slate-900 font-extrabold text-xl tracking-tighter">
                {formatMoney(totalPrice)}
              </span>
            </div>
          )}
          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={handleCartAction}
              disabled={isCreating || disabled}
              whileTap={!disabled ? { scale: 0.96 } : {}}
              className="w-full bg-linear-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBagIcon className="w-6 h-6" />
              )}
              {isCreating
                ? "Adding..."
                : disabled
                  ? "Not Available"
                  : currentCartQty
                    ? "Add More?"
                    : "Add to Cart"}
            </motion.button>
            {currentCartQty ? (
              <ProductRemoveButton
                onRemoveFromCart={onRemoveFromCart}
                isLoading={isCreating}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
