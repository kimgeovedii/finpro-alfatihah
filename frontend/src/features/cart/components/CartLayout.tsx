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
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {  ChevronDownIcon } from "@heroicons/react/24/outline";
import { AccordionContent } from "@/components/layout/AccordionItem";

export function CartLayout() {
    // Handle hook (fetch)
    const { summary, isLoading, fetchCartSummary } = useCartSummary()
    const { carts, meta, isLoadingAllCart, fetchAllCarts } = useAllCartData()

    // Handle hook (action)
    const onSuccess = () => {
        fetchCartSummary()
        fetchAllCarts(1)
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
                        : carts.length === 0 ? 
                            // Render failed fetching condition
                            <MessageBox context={'No items in carts'} image={"/assets/empty.png"} urlButton={'/'} titleButton='Browse Now!' description="Don't miss out! Browse our products today and discover many exciting offers before they run out"/>
                        : 
                            <Accordion type="single" collapsible defaultValue={carts[0]?.id}>
                                {
                                    carts.map(ct => (
                                        <AccordionItem key={ct.id} value={ct.id} className="border-none [&>div]:border-none">
                                            <div className="mb-5 bg-white p-5 rounded-xl shadow">
                                                <BranchHeader 
                                                    storeName={ct.branch.storeName} 
                                                    slug={ct.branch.slug ?? ct.branch.storeName}
                                                    city={ct.branch.city ?? "-"}
                                                    onRemove={() => handleRemoveCart(ct.id)} 
                                                    cartId={ct.id}
                                                    accordionButton={<>
                                                        <AccordionTrigger className="[&>svg]:!hidden [&>svg]:!invisible hover:no-underline">
                                                            <div className="bg-white text-emerald-600 border-1 border-emerald-600 transition flex gap-2 items-center font-600 rounded-xl px-3 py-1">
                                                                <ChevronDownIcon className="w-5 h-5 transition-transform duration-300 [[data-state=open]_&]:rotate-180"/> 
                                                                <span className="hidden md:block">
                                                                    <span className="[[data-state=open]_&]:hidden">Show Product</span>
                                                                    <span className="hidden [[data-state=open]_&]:block">Hide Product</span>
                                                                </span>
                                                            </div>
                                                        </AccordionTrigger>
                                                    </>}
                                                />
                                                <AccordionContent>
                                                <div className="px-2 mt-4">
                                                    {
                                                        ct.items.map(dt => (
                                                            <CartItemCard key={dt.id}
                                                                {...dt.product.product}
                                                                storeName={ct.branch.storeName}
                                                                mainImage={dt.product.product.productImages[0].imageUrl} qty={localQty[dt.id] ?? dt.quantity} currentStock={dt.product.currentStock} 
                                                                onDecrease={() => handleDecrease(dt.id, dt.quantity, dt.product.product.productName)}
                                                                onIncrease={() => handleIncrease(dt.id, dt.quantity, dt.product.currentStock)}                        
                                                                onRemove={() => handleRemoveCartItem(dt.id, `(${dt.quantity}) ${dt.product.product.productName}`)}
                                                            />
                                                        ))
                                                    }
                                                </div>
                                                </AccordionContent>
                                            </div>
                                        </AccordionItem>
                                    ))
                                }
                            </Accordion>
                        }
                        {/* Pagination */}
                        { meta && meta.page < meta.totalPages && <Button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg" onClick={() => fetchAllCarts(meta.page + 1)}>See More</Button> }
                    </div>
                </div>
            </div>
        </div>
    )
}