"use client";

import { useAllCartData, useCartSummary } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"
import { BranchHeader } from "@/features/cart/components/BranchHeader";
import { CartItemCard } from "@/features/cart/components/CartItemCard";

export default function CartPage() {
  const { summary, isLoading } = useCartSummary()
  const { carts, isLoading: cartLoading } = useAllCartData()

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
            {
              cartLoading ? (
              <p className="text-slate-400">Loading carts...</p>
            ) : carts.length === 0 ? (
              <p className="text-slate-500">No items in cart</p>
            ) : (
              carts.map((cart: any) => (
                <div key={cart.id} className="mb-6">
                  <BranchHeader id={cart.branch.id} storeName={cart.branch.storeName}/>
                  {
                    cart.items.map((item: any) => (
                      <CartItemCard key={item.id}
                        slugName={item.product.id} branchId={cart.branchId} productName={item.product.product.productName} description={item.product.product.description} 
                        basePrice={item.product.product.basePrice} mainImage="/mainImages/coke.png" qty={item.quantity}
                        onIncrease={() => console.log("increase")}
                        onDecrease={() => console.log("decrease")}
                        onRemove={() => console.log("remove")}
                      />
                    ))
                  }
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}