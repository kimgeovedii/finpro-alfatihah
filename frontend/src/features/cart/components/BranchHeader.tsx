import { BuildingOfficeIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import React from "react"

type Props = {
    id: string
    storeName: string
}

export const BranchHeader: React.FC<Props> = ({ storeName, id }) => {
    return (
        <div className="flex items-center gap-3 mb-4 mt-10">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BuildingOfficeIcon className="w-5 h-5"/>
            </div>
            <Link href={`/branch/${id}`}>
                <h3 className="text-xl md:text-xl font-bold text-slate-800 tracking-tight cursor-pointer">{storeName}</h3>
            </Link>
            <div className="flex-1 h-px bg-slate-200 ml-4"></div>
        </div>
    )
}