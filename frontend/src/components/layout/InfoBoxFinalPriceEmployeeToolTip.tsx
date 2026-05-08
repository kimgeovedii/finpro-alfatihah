import { InformationCircleIcon } from "@heroicons/react/24/outline"
import React from "react"

export const InfoBoxFinalPriceEmployeeToolTip: React.FC = () => {
    return (
        <>
            <InformationCircleIcon className="w-4 h-4 cursor-pointer"/>
            <div className="absolute bg-blue-500 shadow right-0 top-full mt-2 w-64 rounded-lg text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 capitalize whitespace-normal break-words text-start">
                This final price doesn't include <b>shipping cost</b>.
            </div>
        </>
    )
}