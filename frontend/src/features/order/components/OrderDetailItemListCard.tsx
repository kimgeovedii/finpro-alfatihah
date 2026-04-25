import React from "react"

type OrderItem = {
    branchInventoriesId: string
    productName: string
    description: string
    category: string
    imageUrl?: string
    quantity: number
    basePrice: number
    totalPrice: number
}

type Props = {
    items: OrderItem[]
}

export const OrderDetailItemListCard: React.FC<Props> = ({ items }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-800 font-bold">Order Items</p>
                <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    {items.length} Item{items.length !== 1 ? "s" : ""}
                </span>
            </div>
            <div className="flex flex-col divide-y divide-slate-100 max-h-[70vh] overflow-y-auto pr-3">
                {
                    items.map((dt, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                { dt.imageUrl ? <img src={dt.imageUrl} alt={dt.productName} className="w-full h-full object-cover"/> : <span className="text-2xl">🛒</span> }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{dt.category}</p>
                                <p className="text-sm font-semibold text-slate-800 line-clamp-3">{dt.productName}</p>
                                <p className="text-xs text-slate-400 line-clamp-3">{dt.description}</p>
                                <span className="inline-block mt-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    Qty: {dt.quantity}
                                </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-slate-800">Rp. {(dt.basePrice * dt.quantity).toLocaleString()}</p>
                                <p className="text-xs text-slate-400 font-semibold">Rp. {dt.basePrice.toLocaleString()} / item</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}