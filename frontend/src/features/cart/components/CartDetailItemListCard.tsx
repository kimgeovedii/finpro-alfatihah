import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { ProductOrderCartItemCard } from "@/components/layout/ProductOrderCartItemCard"
import { ProductOrderCartItem } from "@/types/product.type"
import React from "react"

type Props = {
    cartId: string
    branchName: string
    items: ProductOrderCartItem[]
    onIncrease: (itemId: string, qty: number, stock: number) => void
    onDecrease: (cartItemId: string, qty: number, productName: string) => void
    onRemove: (cartItemId: string, productName: string) => void
}

export const CartDetailItemListCard: React.FC<Props> = ({ items, branchName, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <HeadingText children="Selected Product" level={2}/>
                <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    {items.length} Product{items.length !== 1 ? "s" : ""}
                </span>
            </div>
            <DividerLine/>
            <div className="flex flex-col divide-y divide-slate-100 max-h-[50vh] overflow-y-auto pr-3">
                {
                    items.map((dt, idx) => 
                        <ProductOrderCartItemCard key={idx}
                            item={dt}
                            variant="cart"
                            branchName={branchName}
                            onIncrease={() => onIncrease(dt.id, dt.quantity, dt.currentStock ?? 0)}
                            onDecrease={() => onDecrease(dt.id, dt.quantity, dt.productName)}
                            onRemove={() => onRemove(dt.id, `(${dt.quantity}) ${dt.productName}`)}
                        />
                    )
                }
            </div>
        </div>
    )
}