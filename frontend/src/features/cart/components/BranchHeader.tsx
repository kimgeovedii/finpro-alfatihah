import { Button } from "@/components/ui/button"
import { BuildingOfficeIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import React from "react"

type Props = {
    id: string
    cartId: string
    storeName: string

    onRemove: () => void
}

export const BranchHeader: React.FC<Props> = ({ storeName, id, cartId, onRemove }) => {
    return (
        <div className="flex items-center gap-3 mb-4 mt-10">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BuildingOfficeIcon className="w-5 h-5"/>
            </div>
            <Link href={`/branch/${id}`}>
                <h3 className="text-xl md:text-xl font-bold text-slate-800 tracking-tight cursor-pointer">{storeName}</h3>
            </Link>
            <div className="flex-1 h-px bg-slate-200 ml-4"></div>
            <Button onClick={onRemove} className="bg-white text-slate-400 border border-slate-400 hover:text-red-500 hover:border-red-500 transition cursor-pointer flex gap-2 items-center rounded-xl px-3 py-1">
                <TrashIcon className="w-5 h-5"/> Remove
            </Button>
            <Link href={`/cart/${cartId}`}>
                <Button className="bg-emerald-600 text-white shadow hover:bg-emerald-700 transition flex gap-2 items-center font-600 rounded-xl px-3 py-1">
                    <ShoppingCartIcon className="w-5 h-5"/> Buy This
                </Button>
            </Link>
        </div>
    )
}