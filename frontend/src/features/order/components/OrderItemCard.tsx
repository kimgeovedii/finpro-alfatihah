import { CopyFieldButton } from "@/components/button/CopyFieldButton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/converter.util"
import React from "react"
import Swal from "sweetalert2"
import { statusColorMap } from "@/constants/business.const"
import { ArrowRightIcon, PhotoIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { PaymentEvidenceUploadButton } from "./PaymentEvidenceUploadButton"
import { DividerLine } from "@/components/layout/DividerLine"

type Props = {
    orderId: string
    orderNumber: string
    status: string
    totalPrice: number
    finalPrice: number
    shippingCost: number
    paymentDeadline: string
    totalItems: number
    productList: string
    createdAt: string
    paymentMethod?: string
    paymentStatus?: string
    paymentEvidence?: string
}

export const OrderItemCard: React.FC<Props> = ({ orderId, orderNumber, status, totalPrice, finalPrice, shippingCost, paymentDeadline, totalItems, productList, createdAt, paymentEvidence, paymentMethod, paymentStatus }) => {
    // Color mapping
    const statusClass = statusColorMap[status] || "bg-slate-400"
    const finalStatus = status.replaceAll('_',' ')

    const evidenceElement = (url: string) => {
        const handleClick = () => {
            Swal.fire({
                title: "Payment Evidence",
                imageUrl: url,
                imageAlt: "Payment Evidence",
                confirmButtonColor: "#10b981",
                confirmButtonText: "Close",
                width: 600,
            })
        }
    
        return (
            <Button variant="outline" onClick={handleClick}>
                <PhotoIcon className="w-4 h-4"/> See Evidence
            </Button>
        )
    }

    return (
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="w-full">
                <div className="flex w-full justify-between items-center">
                    <p className="text-slate-500 text-sm mb-0">Order Number</p>
                    <Badge className={`capitalize font-semibold ${statusClass}`}>{finalStatus}</Badge>
                </div>
                <CopyFieldButton label="Order number" value={orderNumber} />
                <p className="text-slate-500 text-sm mb-1"><span>({totalItems})</span> Purchased Item</p>
                <p className="text-slate-500 text-sm font-semibold mb-0">{productList}</p>
                { status === 'WAITING_PAYMENT' && paymentEvidence === null && paymentMethod === "MANUAL" && <PaymentEvidenceUploadButton orderId={orderId} paymentDeadline={paymentDeadline}/> }
                {
                    status === 'WAITING_PAYMENT' && paymentEvidence !== null && 
                        <>
                            <DividerLine/>
                            <div className="bg-green-100 p-2 rounded-lg flex justify-between w-full items-center">
                                <p className="text-gray-700 font-bold text-sm">Now just wait until your payment validated</p>
                                <div className="text-end">
                                    <p className="text-gray-700 font-normal text-sm mb-1">Evidence Uploaded!</p>
                                    {evidenceElement(paymentEvidence??"")}
                                </div>
                            </div>
                        </>
                }
                {
                    status === 'REJECTED' && paymentEvidence !== null && 
                        <>
                            <DividerLine/>
                            <div className="bg-red-100 p-2 rounded-lg w-full">
                                <p className="text-gray-700 font-bold text-sm">We're sorry. But your transaction is rejected by our shop</p>
                                {evidenceElement(paymentEvidence??"")}
                            </div>
                        </>
                }
                <DividerLine/>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <p className="text-gray-500 font-normal text-sm mb-0">Checkout At</p>
                        <p className="text-gray-500 font-bold text-sm mb-2">{formatDate(createdAt,false)}</p>
                        <Link href={`/transaction/${orderNumber}`}>
                            <Button className="bg-teal-700 text-white font-semibold text-sm px-3"><ArrowRightIcon/> Manage</Button>
                        </Link>
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