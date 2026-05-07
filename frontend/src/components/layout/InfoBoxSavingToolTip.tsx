import { InformationCircleIcon } from "@heroicons/react/24/outline"
import React from "react"

export const InfoBoxSavingToolTip: React.FC = () => {
    return (
        <>
            <InformationCircleIcon className="w-4 h-4 cursor-pointer"/>
            <div className="absolute bg-teal-700 shadow-md shadow-primary right-0 top-full mt-2 w-64 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                This total saving included <b>discount</b> and <b>voucher</b>.
            </div>
        </>
    )
}