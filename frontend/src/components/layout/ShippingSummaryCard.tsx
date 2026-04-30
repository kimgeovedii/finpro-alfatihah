import React from "react"
import { InfoBoxShippingWeightToolTip } from "./InfoBoxShippingWeightToolTip"
import { courierShippingDefault, currencyFormat } from "@/constants/business.const"

type Props = {
    shippingWeight: number
    shippingCost: number
}

export const ShippingSummaryCard: React.FC<Props> = ({ shippingWeight, shippingCost }) => {
    return (
        <div>
            <h5 className="font-semibold">Shipping</h5>
            <div className="flex justify-between">
                <p>Courier</p>
                <h6 className="font-bold uppercase">{courierShippingDefault}</h6>
            </div>
            <div className="flex justify-between">
                <p>Total Cost</p>
                <h6 className="font-bold">Rp. {shippingCost.toLocaleString(currencyFormat)}</h6>
            </div>
            <div className="flex justify-between">
                <p>Total Weight</p>
                <div className="flex items-center gap-2 relative group">
                    <h6 className="font-bold">{(shippingWeight / 1000).toFixed(2)} Kg</h6>
                    <InfoBoxShippingWeightToolTip shippingWeight={shippingWeight}/>
                </div>
            </div>
        </div>
    )
}