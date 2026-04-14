"use client";

import { useUser } from "@/features/auth/hooks/useUser"
import { useCart } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"
import { BranchHeader } from "@/features/cart/components/BranchHeader";
import { CartItemCard } from "@/features/cart/components/CartItemCard";

export default function CartPage() {
  const { user } = useUser()
  const { summary, isLoading } = useCart()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
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
          <hr className="my-5"/>
          <div>
            <BranchHeader id="1" storeName="Toko Pusat Jakarta" />
            <CartItemCard
              slugName="1"
              branchId="2"
              productName="Coca Cola"
              description="350ml Can"
              basePrice={10000}
              mainImage="/mainImages/coke.png"
              qty={3}
              onIncrease={() => console.log("increase")}
              onDecrease={() => console.log("decrease")}
              onRemove={() => console.log("remove")}
            />
            <CartItemCard
              slugName="1"
              branchId="2"
              productName="Coca Cola"
              description="350ml Can"
              basePrice={10000}
              mainImage="/mainImages/coke.png"
              qty={3}
              onIncrease={() => console.log("increase")}
              onDecrease={() => console.log("decrease")}
              onRemove={() => console.log("remove")}
            />
            <BranchHeader id="2" storeName="Toko Pusat Jakarta" />
            <CartItemCard
              slugName="1"
              branchId="2"
              productName="Coca Cola"
              description="350ml Can"
              basePrice={10000}
              mainImage="/mainImages/coke.png"
              qty={3}
              onIncrease={() => console.log("increase")}
              onDecrease={() => console.log("decrease")}
              onRemove={() => console.log("remove")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}