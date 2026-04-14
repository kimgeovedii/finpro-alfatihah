import { CopyField } from "@/components/button/CopyField"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/converter.util"
import React from "react"

type Props = {
    orderNumber: string
    status: string
    totalPrice: number
    finalPrice: number
    shippingCost: number
    paymentDeadline: string
    totalItems: number
    productList: string
    createdAt: string

    onComplete?: () => void
    onDetail?: () => void
}

export const OrderItemCard: React.FC<Props> = ({ orderNumber, status, totalPrice, finalPrice, shippingCost, paymentDeadline, totalItems, productList, createdAt, onComplete, onDetail }) => {
    const statusColorMap: Record<string, string> = {
        CANCELLED: "bg-red-400",
        WAITING_PAYMENT: "bg-orange-400",
        WAITING_PAYMENT_CONFIRMATION: "bg-orange-400",
        PROCESSING: "bg-blue-400",
        SHIPPED: "bg-purple-400",
        CONFIRMED: "bg-emerald-400",
    }
    const statusClass = statusColorMap[status] || "bg-slate-400"
    const finalStatus = status.replaceAll('_',' ')

    return (
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="w-full">
                <div className="flex w-full justify-between items-center">
                    <p className="text-slate-500 text-sm mb-0">Order Number</p>
                    <Badge className={`capitalize font-semibold ${statusClass}`}>{finalStatus}</Badge>
                </div>
                <CopyField label="Order number" value={orderNumber} />
                <p className="text-slate-500 text-sm mb-0"><span>({totalItems})</span> Purchased Item</p>
                <p className="text-slate-500 text-sm font-semibold mb-0">{productList}</p>
                <hr className="my-3"/>
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-4 items-center">
                        {
                            status === 'WAITING_PAYMENT' && 
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <p className="text-gray-700 font-normal text-sm mb-0">Finish Payment Before</p>
                                    <p className="text-gray-700 font-bold text-sm">{formatDate(paymentDeadline,true)}</p>
                                </div>
                        }
                        <div>
                            <p className="text-gray-500 font-normal text-sm mb-0">Checkout At</p>
                            <p className="text-gray-500 font-bold text-sm">{formatDate(createdAt,false)}</p>
                        </div>
                    </div>
                    <div className="text-end">
                        {
                            status !== 'CANCELLED' && 
                                <div className="flex gap-x-4 items-end">
                                        <div>
                                            <p className="text-emerald-600 font-semibold text-sm">shipping cost</p>
                                            <p className="text-emerald-600 font-semibold text-sm">Rp. {shippingCost.toLocaleString("id-ID")}</p>
                                        </div>
                                        <div>
                                        <p className="text-gray-500 font-semibold text-sm mb-0">Total Spend</p>
                                        <p className="text-emerald-800 font-bold text-xl">Rp {finalPrice.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                        }
                        {
                            totalPrice !== finalPrice && status !== 'CANCELLED' &&
                                <div className="bg-red-100 p-1 text-center rounded-md mt-1">
                                    <p className="text-gray-500 font-semibold text-sm mb-0">You saved <b className="text-red-400">Rp. {(totalPrice - finalPrice).toLocaleString("id-ID")}</b></p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}