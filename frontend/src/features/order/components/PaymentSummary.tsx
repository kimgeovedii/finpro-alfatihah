import { Button } from "@/components/ui/button"
import { Headset, Receipt } from "lucide-react"
import React from "react"
import { PaymentEvidenceUploadButton } from "./PaymentEvidenceUploadButton"
import { OrderCancelButton } from "./OrderCancelButton"

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
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">Payment Summary</h5>
            <div className="flex justify-between">
                <p>Total Items <b>({totalItem})</b></p>
                <h6 className="font-bold">Rp. {totalPrice.toLocaleString()}</h6>
            </div>
            <div className="flex justify-between">
                <p>Shipping Cost</p>
                <h6 className="font-bold">Rp. {shippingCost.toLocaleString()}</h6>
            </div>
            <div className="flex justify-between">
                <p>Shipping Weight</p>
                <h6 className="font-bold">{(shippingWeight / 1000).toFixed(2)} Kg</h6>
            </div>
            <div className="flex justify-between">
                <p>Total Saving</p>
                <h6 className="font-bold">{totalSaving > 0 ? <>-</>:<></>}Rp. {totalSaving.toLocaleString()}</h6>
            </div>
            <hr className="my-3"/>
            <div className="flex justify-between">
                <h6 className="font-bold">Final Price</h6>
                <h4 className="font-bold text-xl">Rp. {finalPrice.toLocaleString()}</h4>
            </div>
            <hr className="mt-3 mb-5"/>
            <div className="flex flex-col gap-3">
                { status === 'WAITING_PAYMENT' && paymentEvidence === null && paymentMethod === "MANUAL" && <PaymentEvidenceUploadButton orderId={orderId} paymentDeadline={paymentDeadline}/> }
                { status === 'WAITING_PAYMENT' && <OrderCancelButton orderNumber={orderNumber} onCancel={onCancel}/> }
            </div>
            <div className="flex gap-5 w-full mt-3">
                { status && ["SHIPPED","CONFIRMED"].includes(status) && <Button variant='outline' className="flex-1 h-10 bg-white hover:bg-[#00767a] text-teal-700 hover:text-white font-bold rounded-[8px] shadow-lg border-teal-700 border-1 transition-all duration-300 active:scale-[0.97] disabled:opacity-70"><Receipt/>Download Invoice</Button> }
                <Button className="flex-1 h-10 bg-primary-teal hover:bg-[#00767a] text-white font-bold rounded-[8px] shadow-lg shadow-primary-teal/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70"><Headset/> Help Center</Button>
            </div>
        </div>
    )
}