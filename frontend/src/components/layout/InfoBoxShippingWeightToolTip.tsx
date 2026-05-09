import { InformationCircleIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    shippingWeight: number
}

export const InfoBoxShippingWeightToolTip: React.FC<Props> = ({ shippingWeight }) => {
    return (
        <>
            <InformationCircleIcon className="w-4 h-4 cursor-pointer"/>
            <div className="absolute bg-teal-700 shadow-md shadow-primary right-0 top-full mt-2 w-64 rounded-lg text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                This is your <b>order's total weight</b>. For shipping and payment, carriers round it up to <b>{Math.ceil(shippingWeight / 1000)} kg</b>.
            </div>
        </>
    )
}