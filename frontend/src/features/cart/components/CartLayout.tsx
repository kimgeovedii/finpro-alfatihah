"use client";
import { useAllCartData, useCartSummary } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"
import { BranchHeader } from "@/features/cart/components/BranchHeader";
import { CartItemCard } from "@/features/cart/components/CartItemCard";
import { MessageBox } from "@/components/layout/MessageBox";
import { SkeletonBox } from "@/components/layout/SkeletonBox";
import { DividerLine } from "@/components/layout/DividerLine";
import { HeadingText } from "@/components/layout/HeadingText";
import { useCartActions } from "@/features/cart/hooks/useCartAction";
import { useHomeStore } from "@/features/home/service/home.service";
import { useEffect } from "react";

export function CartLayout() {
    const { selectedAddressId, userCoords } = useHomeStore()
    const coordinate = userCoords?.lat && userCoords?.lng ? `${userCoords.lat},${userCoords.lng}` : null

    // Handle hook (fetch)
    const { summary, isLoading, fetchCartSummary } = useCartSummary()
    const { cart, isLoadingAllCart, fetchAllCarts } = useAllCartData(selectedAddressId, coordinate)

    useEffect(() => {
        if (!selectedAddressId && !coordinate) return
    
        fetchCartSummary()
        fetchAllCarts(selectedAddressId, coordinate)
    }, [selectedAddressId, coordinate])

    // Handle hook (action)
    const onSuccess = () => {
        fetchCartSummary()
        fetchAllCarts(selectedAddressId, coordinate)
    }

    const { handleRemoveCart, handleRemoveCartItem, handleIncrease, handleDecrease, localQty } = useCartActions(onSuccess)
    
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <HeadingText children="My Cart" level={1}/>
                    {
                        // Render loading element
                        isLoading ? 
                            <SkeletonBox extraClass={'min-h-[30px]'}/> 
                        : 
                            <CartSummary totalItems={summary?.totalItems ?? 0} totalQty={summary?.totalQty ?? 0}/>
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
                            : !cart ? 
                                // Render failed fetching condition
                                <MessageBox context={'No store is available near your location.'} image={"/assets/empty.png"} urlButton={'/'} titleButton='Browse Now!' description="Try adjusting your location"/>
                            : 
                            
                                <div className="mb-5 bg-white p-5 rounded-xl shadow">
                                    <BranchHeader 
                                        storeName={cart.branch.storeName} 
                                        slug={cart.branch.slug ?? cart.branch.storeName}
                                        city={cart.branch.city ?? "-"}
                                        onRemove={() => handleRemoveCart(cart.id)} 
                                        cartId={cart.id}
                                        distance={cart.distance}
                                    />
                                    <div className="px-2 mt-4">
                                        {
                                            cart.items.map(dt => (
                                                <CartItemCard key={dt.id}
                                                    {...dt.product.product}
                                                    storeName={cart.branch.storeName}
                                                    mainImage={dt.product.product.productImages[0].imageUrl} qty={localQty[dt.id] ?? dt.quantity} currentStock={dt.product.currentStock} 
                                                    onDecrease={() => handleDecrease(dt.id, dt.quantity, dt.product.product.productName)}
                                                    onIncrease={() => handleIncrease(dt.id, dt.quantity, dt.product.currentStock)}                        
                                                    onRemove={() => handleRemoveCartItem(dt.id, `(${dt.quantity}) ${dt.product.product.productName}`)}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}