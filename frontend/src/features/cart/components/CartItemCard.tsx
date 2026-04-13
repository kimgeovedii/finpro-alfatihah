import { TrashIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import React from "react"

type Props = {
    slugName: string
    productName: string
    variant: string
    basePrice: number
    mainImage: string
    qty: number
    branchId: string

    onIncrease: () => void
    onDecrease: () => void
    onRemove: () => void
}

export const CartItemCard: React.FC<Props> = ({ slugName, branchId, productName, variant, basePrice, mainImage, qty, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="flex items-center gap-5">
                <img src={mainImage} alt={productName} className="w-20 h-20 rounded-xl object-cover shadow"/>
                <div>
                    <Link href={`/branch/${branchId}/product/${slugName}`}>
                        <h3 className="text-lg font-semibold text-slate-800">{productName}</h3>
                    </Link>
                    <p className="text-slate-500 text-sm">{variant}</p>
                    <p className="text-emerald-700 font-bold text-lg mt-2">Rp {basePrice.toLocaleString("id-ID")}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
                    <TrashIcon className="w-5 h-5"/>
                </button>
                <div className="flex items-center bg-slate-100/70 rounded-full p-1 shadow-inner">
                    <button onClick={onDecrease} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-white transition">-</button>
                    <span className="w-10 text-center font-semibold text-slate-800">{qty}</span>
                    <button onClick={onIncrease} className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">+</button>
                </div>
            </div>
        </div>
    )
}