import React from "react"
import { InfoBoxShippingWeightToolTip } from "./InfoBoxShippingWeightToolTip"
import { courierShippingDefault, currencyFormat } from "@/constants/business.const"
import { HeadingText } from "./HeadingText"

type Props = {
    shippingWeight: number
    shippingCost: number
}

export const ShippingSummaryCard: React.FC<Props> = ({ shippingWeight, shippingCost }) => {
    return (
        <>
            <HeadingText children="Shipping" level={3}/>
            <div className="flex justify-between">
                <p>Courier</p>
                <p className="font-bold uppercase">{courierShippingDefault}</p>
            </div>
            <div className="flex justify-between">
                <p>Total Cost</p>
                <p className="font-bold">Rp. {shippingCost.toLocaleString(currencyFormat)}</p>
            </div>
            <div className="flex justify-between">
                <p>Total Weight</p>
                <div className="flex items-center gap-2 relative group">
                    <p className="font-bold">{(shippingWeight / 1000).toFixed(2)} Kg</p>
                    <InfoBoxShippingWeightToolTip shippingWeight={shippingWeight}/>
                </div>
            </div>
        </>
    )
}