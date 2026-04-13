"use client";

import { useUser } from "@/features/auth/hooks/useUser"
import { useCart } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"

export default function CartPage() {
  const { user } = useUser()
  const { summary, isLoading } = useCart()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Your Basket
          </h1>
          {
            isLoading ? <p className="text-slate-400 mt-1">Loading...</p> : 
              <CartSummary
                totalItems={summary?.totalItems ?? 0}
                totalQty={summary?.totalQty ?? 0}
              />
          }
        </div>
      </div>
    </div>
  )
}