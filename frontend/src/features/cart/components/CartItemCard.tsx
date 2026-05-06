import { HeadingText } from "@/components/layout/HeadingText"
import { Button } from "@/components/ui/button"
import { currencyFormat } from "@/constants/business.const"
import { TrashIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type Props = {
    slugName: string
    productName: string
    basePrice: number
    mainImage: string
    qty: number
    currentStock: number
    storeName: string
    onIncrease: () => void
    onDecrease: () => void
    onRemove: () => void
}

export const CartItemCard: React.FC<Props> = ({ slugName, storeName, productName, basePrice, mainImage, qty, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center md:items-start lg:items-center justify-between p-2 px-0 transition-all duration-300 mb-2">
            <div className="flex flex-row items-center gap-5 w-full">
                <Image src={mainImage} alt={mainImage} className="w-20 h-20 rounded-xl object-cover shadow" height={100} width={100}/>
                <div>
                    <Link href={`/${storeName}/${slugName}`}>
                        <HeadingText level={3} children={productName}/>
                    </Link>
                    <div className="flex gap-2 items-center flex mt-2">
                        <p className="text-emerald-700 font-bold text-lg">Rp {basePrice.toLocaleString(currencyFormat)}</p>
                        <p className="text-gray-500 text-sm">/ item</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center w-full lg:w-auto justify-between gap-5 mt-2 lg:mt-0">
                <Button onClick={onRemove} className="bg-transparent text-slate-400 text-red-500 border-1 border-red-500 rounded-full hover:bg-red-500 hover:text-white transition cursor-pointer">
                    <TrashIcon className="w-5 h-5"/>
                </Button>
                <div className="flex items-center justify-end bg-slate-100/70 rounded-full p-1 shadow-inner">
                    <Button onClick={onDecrease} className="bg-transparent w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:bg-white transition">-</Button>
                    <span className="w-10 text-center font-semibold text-slate-800">{qty}</span>
                    <Button onClick={onIncrease} className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">+</Button>
                </div>
            </div>
        </div>
    )
}