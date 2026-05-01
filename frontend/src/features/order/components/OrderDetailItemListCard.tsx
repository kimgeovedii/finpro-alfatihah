import { ProductOrderCartItemCard } from "@/components/layout/ProductOrderCartItemCard"
import { ProductOrderCartItem } from "@/types/product.type"
import React from "react"

type Props = {
    branchName: string
    items: ProductOrderCartItem[]
}

export const OrderDetailItemListCard: React.FC<Props> = ({ items, branchName }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-800 font-bold">Order Items</p>
                <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    {items.length} Item{items.length !== 1 ? "s" : ""}
                </span>
            </div>
            <div className="flex flex-col divide-y divide-slate-100 max-h-[70vh] overflow-y-auto pr-3">
                { items.map((dt, idx) => <ProductOrderCartItemCard key={idx} branchName={branchName} item={dt} variant="order"/> ) }
            </div>
        </div>
    )
}