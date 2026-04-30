import { DividerLine } from "@/components/layout/DividerLine"
import { currencyFormat } from "@/constants/business.const"

type Props = {
    method: string
    status: string 
    shippingCost: number
    finalPrice: number
}

export const OrderManagementTableOrderPlacedSection: React.FC<Props> = ({ method, status, shippingCost, finalPrice }) => {
    return (
        <div className="border-1 rounded-lg p-4 shadow-md w-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="text-sm">Payment Method</p>
                    <p className="text-sm font-bold">{method}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">Payment Status</p>
                    <p className={`text-xs font-bold px-2 py-1 rounded-lg ${status === "REJECTED" ? 'bg-red-100 text-red-500' : status === "PENDING" ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-500'}`}>{status}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">Shipping Cost</p>
                    <p className="text-sm font-bold">Rp. {shippingCost.toLocaleString(currencyFormat)}</p>
                </div>
            </div>
            <DividerLine/>
            <div className="flex justify-between">
                <p className="font-bold text-lg">Final Price</p>
                <p className="font-bold text-lg">Rp. {finalPrice.toLocaleString(currencyFormat)}</p>
            </div>
        </div>
    )
}
