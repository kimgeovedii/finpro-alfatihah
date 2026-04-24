import { Button } from "@/components/ui/button"
import { TrashIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type Props = {
    slugName: string
    productName: string
    description: string
    basePrice: number
    mainImage: string
    qty: number
    currentStock: number
    branchId: string

    onIncrease: () => void
    onDecrease: () => void
    onRemove: () => void
}

export const CartItemCard: React.FC<Props> = ({ slugName, branchId, productName, description, basePrice, mainImage, qty, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 p-3 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
                <Image src={mainImage} alt={productName} className="w-full h-40 sm:w-20 sm:h-20 rounded-xl object-cover shadow" height={100} width={100}/>
                <div>
                    <Link href={`/branch/${branchId}/product/${slugName}`}>
                        <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{productName}</h3>
                    </Link>
                    <p className="text-slate-500 text-sm line-clamp-2">{description}</p>
                    <p className="text-emerald-700 font-bold text-lg mt-2 hidden lg:block">Rp {basePrice.toLocaleString("id-ID")}</p>
                </div>
            </div>
            <div className="flex items-center w-full lg:w-auto justify-between gap-5 mt-2 lg:mt-0">
                <p className="text-emerald-700 font-bold text-lg mt-2 block lg:hidden">Rp {basePrice.toLocaleString("id-ID")}</p>
                <div className="flex items-center gap-2">
                    <Button onClick={onRemove} className="bg-transparent text-slate-400 hover:text-red-500 transition cursor-pointer">
                        <TrashIcon className="w-5 h-5"/>
                    </Button>
                    <div className="flex items-center justify-end w-full bg-slate-100/70 rounded-full p-1 shadow-inner">
                        <Button onClick={onDecrease} className="bg-transparent w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-white transition">-</Button>
                        <span className="w-10 text-center font-semibold text-slate-800">{qty}</span>
                        <Button onClick={onIncrease} className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">+</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}