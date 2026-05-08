import { Button } from "@/components/ui/button"
import React from "react"
import { PaymentEvidenceUploadButton } from "./PaymentEvidenceUploadButton"
import { OrderCancelButton } from "./OrderCancelButton"
import { useDownloadInvoice } from "../hooks/useExport"
import { currencyFormat } from "@/constants/business.const"
import { ShippingSummaryCard } from "@/components/layout/ShippingSummaryCard"
import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { DocumentIcon } from "@heroicons/react/24/outline"
import { PaymentHelpDialog } from "@/components/layout/PaymentHelpDialog"
import { InfoBoxSavingToolTip } from "@/components/layout/InfoBoxSavingToolTip"

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
    onSuccess: () => void
}

export const PaymentSummaryCard: React.FC<Props> = ({ totalItem, shippingCost, totalPrice, totalSaving, finalPrice, orderId, status, paymentDeadline, paymentEvidence, orderNumber, onCancel, paymentMethod, shippingWeight, onSuccess }) => {
    // Handle hooks (action)
    const { downloadInvoiceOrder } = useDownloadInvoice()
    
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="flex justify-between items-center">
                <HeadingText children="Payment Summary" level={2}/>
                <PaymentHelpDialog/>
            </div>
            <DividerLine/>
            <div className="flex justify-between">
                <p>Total Items <b>({totalItem})</b></p>
                <p className="font-bold">Rp. {totalPrice.toLocaleString(currencyFormat)}</p>
            </div>
            {
                totalSaving > 0 && 
                    <div className="flex justify-between">
                        <p>Total Saving</p>
                        <div className="flex gap-2 items-center relative group">
                            <p className="font-bold">Rp. {totalSaving.toLocaleString(currencyFormat)}</p>
                            <InfoBoxSavingToolTip/>
                        </div>
                    </div>
            }
            <DividerLine/>
            <ShippingSummaryCard shippingWeight={shippingWeight} shippingCost={shippingCost}/>
            <DividerLine/>
            <div className="flex justify-between">
                <HeadingText children="Final Price" level={3}/>
                <p className="font-bold text-xl">Rp. {Math.ceil(finalPrice + shippingCost).toLocaleString(currencyFormat)}</p>
            </div>
            { !['WAITING_PAYMENT_CONFIRMATION', 'PROCESSING', 'CANCELLED'].includes(status) && <DividerLine/> }
            <div className="flex flex-col gap-3">
                { status === 'WAITING_PAYMENT' && paymentEvidence === null && paymentMethod === "MANUAL" && <PaymentEvidenceUploadButton orderId={orderId} paymentDeadline={paymentDeadline} onSuccess={onSuccess} isShowDestinationAccount={true}/> }
                { status === 'WAITING_PAYMENT' && <OrderCancelButton orderNumber={orderNumber} onCancel={onCancel}/> }
            </div>
            <div className="flex gap-5 w-full mt-3">
                { 
                    status && ["SHIPPED","CONFIRMED"].includes(status) && 
                        <Button variant='outline' onClick={() => downloadInvoiceOrder(orderNumber)} className="flex-1 h-10 bg-white hover:bg-[#00767a] text-teal-700 hover:text-white font-bold rounded-[8px] shadow-lg border-teal-700 border-1 transition-all duration-300 active:scale-[0.97] disabled:opacity-70">
                            <DocumentIcon/>Download Invoice
                        </Button> 
                }
            </div>
        </div>
    )
}