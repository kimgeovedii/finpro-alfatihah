"use client";
import { useAllCartData, useCartSummary } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"
import { BranchHeader } from "@/features/cart/components/BranchHeader";
import { CartItemCard } from "@/features/cart/components/CartItemCard";
import { Button } from "@/components/ui/button";
import { MessageBox } from "@/components/layout/MessageBox";
import { SkeletonBox } from "@/components/layout/SkeletonBox";
import { DividerLine } from "@/components/layout/DividerLine";
import { HeadingText } from "@/components/layout/HeadingText";
import { useCartActions } from "@/features/cart/hooks/useCartAction";

export default function CartPage() {
  // Handle hook (fetch)
  const { summary, isLoading, fetchCartSummary } = useCartSummary()
  const { carts, meta, isLoadingAllCart, fetchAllCarts } = useAllCartData()

  // Call hook (action)
  const onSuccess = () => {
    fetchCartSummary()
    fetchAllCarts(1)
  }

  const { handleRemoveCart, handleRemoveCartItem, handleIncrease, handleDecrease } = useCartActions(onSuccess)
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <HeadingText children="Your Cart" level={1}/>
          {
            // Render loading element
            isLoading ? <SkeletonBox extraClass={'min-h-[30px]'}/> : <CartSummary totalItems={summary?.totalItems ?? 0} totalQty={summary?.totalQty ?? 0}/>
          }
          <DividerLine/>
          <div>
            {
              isLoadingAllCart ?
                // Render loading element
                <div className="flex flex-col space-y-2">
                  <SkeletonBox extraClass={'min-h-[20px]'}/>
                  <SkeletonBox extraClass={'min-h-[120px]'}/>
                  <SkeletonBox extraClass={'min-h-[120px]'}/>
                </div>
              : carts.length === 0 ? 
                // Render failed fetching condition
                <MessageBox context={'No items in carts'} image={"/assets/empty.png"} urlButton={'/dashboard/products'} titleButton='Browse Now!' description="Don't miss out! Browse our products today and discover many exciting offers before they run out"/>
              : 
                carts.map(ct => (
                  <div key={ct.id} className="mb-6">
                    <BranchHeader 
                      storeName={ct.branch.storeName} 
                      city={ct.branch.city ?? "-"}
                      onRemove={() => handleRemoveCart(ct.id)} 
                      cartId={ct.id}
                    />
                    {
                      ct.items.map(dt => (
                        <CartItemCard key={dt.id}
                          slugName={dt.product.product.slugName} storeName={ct.branch.storeName} productName={dt.product.product.productName} basePrice={dt.product.product.basePrice} 
                          mainImage={dt.product.product.productImages[0].imageUrl} qty={dt.quantity} currentStock={dt.product.currentStock} 
                          onDecrease={() => handleDecrease(dt.id, dt.quantity,dt.product.product.productName)}
                          onIncrease={() => handleIncrease(dt.id, dt.quantity, dt.product.currentStock)}                        
                          onRemove={() => handleRemoveCartItem(dt.id, `(${dt.quantity}) ${dt.product.product.productName}`)}
                        />
                      ))
                    }
                  </div>
                ))
            }
            {/* Pagination */}
            { meta && meta.page < meta.totalPages && <Button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg" onClick={() => fetchAllCarts(meta.page + 1)}>See More</Button> }
          </div>
        </div>
      </div>
    </div>
  )
}