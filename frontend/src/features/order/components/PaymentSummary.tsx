import { Button } from "@/components/ui/button"
import { Headset, Receipt } from "lucide-react"
import React from "react"
import { PaymentEvidenceUploadButton } from "./PaymentEvidenceUploadButton"
import { OrderCancelButton } from "./OrderCancelButton"
import { useDownloadInvoice } from "../hooks/useExport"
import { InfoBoxShippingWeightToolTip } from "@/components/layout/InfoBoxShippingWeightToolTip"
import { courierShippingDefault, currencyFormat } from "@/constants/business.const"
import { ShippingSummaryCard } from "@/components/layout/ShippingSummaryCard"
import { DividerLine } from "@/components/layout/DividerLine"

type Props = {
    orderId: string
    orderNumber: string
    status: string
    paymentDeadline: string
    paymentEvidence?: string | null
    totalItem: number
    shippingWeight: number
    shippingCost: number
    totalPrice: number
    totalSaving: number
    finalPrice: number
    paymentMethod?: string | null
    onCancel: (orderNumber: string) => void
}

export const PaymentSummaryCard: React.FC<Props> = ({ totalItem, shippingCost, totalPrice, totalSaving, finalPrice, orderId, status, paymentDeadline, paymentEvidence, orderNumber, onCancel, paymentMethod, shippingWeight }) => {
    const { downloadInvoiceOrder } = useDownloadInvoice()
    
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">Payment Summary</h5>
            <DividerLine/>
            <div className="flex justify-between">
                <p>Total Items <b>({totalItem})</b></p>
                <h6 className="font-bold">Rp. {totalPrice.toLocaleString(currencyFormat)}</h6>
            </div>
            {
                totalSaving > 0 && 
                    <div className="flex justify-between">
                        <p>Total Saving</p>
                        <h6 className="font-bold">Rp. {totalSaving.toLocaleString(currencyFormat)}</h6>
                    </div>
            }
            <DividerLine/>
            <ShippingSummaryCard shippingWeight={shippingWeight} shippingCost={shippingCost}/>
            <DividerLine/>
            <div className="flex justify-between">
                <h6 className="font-bold">Final Price</h6>
                <h4 className="font-bold text-xl">Rp. {Math.ceil(finalPrice + shippingCost).toLocaleString(currencyFormat)}</h4>
            </div>
            <DividerLine/>
            <div className="flex flex-col gap-3">
                { status === 'WAITING_PAYMENT' && paymentEvidence === null && paymentMethod === "MANUAL" && <PaymentEvidenceUploadButton orderId={orderId} paymentDeadline={paymentDeadline}/> }
                { status === 'WAITING_PAYMENT' && <OrderCancelButton orderNumber={orderNumber} onCancel={onCancel}/> }
            </div>
            <div className="flex gap-5 w-full mt-3">
                { 
                    status && ["SHIPPED","CONFIRMED"].includes(status) && 
                        <Button variant='outline' onClick={() => downloadInvoiceOrder(orderNumber)} className="flex-1 h-10 bg-white hover:bg-[#00767a] text-teal-700 hover:text-white font-bold rounded-[8px] shadow-lg border-teal-700 border-1 transition-all duration-300 active:scale-[0.97] disabled:opacity-70">
                            <Receipt/>Download Invoice
                        </Button> 
                }
                <Button className="flex-1 h-10 bg-teal-700 hover:bg-[#00767a] text-white font-bold rounded-[8px] shadow-lg shadow-primary-teal/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70"><Headset/> Help Center</Button>
            </div>
        </div>
    )
}