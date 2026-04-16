import { CopyField } from "@/components/button/CopyField"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/converter.util"
import { UploadIcon } from "lucide-react"
import React, { useRef } from "react"
import { useUploadPaymentEvidence } from "../hooks/usePayment"
import Swal from "sweetalert2"
import { allowedMimeTypesPaymentEvidence, maxSizePaymentEvidence } from "@/constants/business.const"
import { PhotoIcon } from "@heroicons/react/24/outline"

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

    onComplete?: () => void
    onDetail?: () => void
}

export const OrderItemCard: React.FC<Props> = ({ orderId, orderNumber, status, totalPrice, finalPrice, shippingCost, paymentDeadline, totalItems, productList, createdAt, onComplete, onDetail, paymentEvidence, paymentMethod, paymentStatus }) => {
    // For file handling
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadEvidence, isUploading } = useUploadPaymentEvidence()

    // Color mapping
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

    const handleEvidenceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validation file type
        if (!allowedMimeTypesPaymentEvidence.includes(file.type)) {
            Swal.fire({ 
                icon:"error", 
                title: "Upload failed", 
                text: "Only JPG, JPEG, PNG, and GIF files are allowed.", 
                confirmButtonColor: "#ef4444" 
            })
            return
        }

        // Validation size
        if (file.size > maxSizePaymentEvidence) {
            Swal.fire({ 
                icon:"error", 
                title: "Upload failed", 
                text: "File size must not exceed 10 MB.", 
                confirmButtonColor: "#ef4444" 
            })
            return
        }

        Swal.fire({ title: "Uploading...", allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        const result = await uploadEvidence(orderId, file)

        Swal.fire({ 
            icon: result.success ? "success" : "error", 
            title: result.success ? result.message : "Upload failed", 
            text: result.message, 
            confirmButtonColor: result.success ? "#10b981" : "#ef4444" 
        })
    }

    const handleClickUpload = () => {
        fileInputRef.current?.click()
    }

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
                <CopyField label="Order number" value={orderNumber} />
                <p className="text-slate-500 text-sm mb-1"><span>({totalItems})</span> Purchased Item</p>
                <p className="text-slate-500 text-sm font-semibold mb-0">{productList}</p>
                {
                    status === 'WAITING_PAYMENT' && paymentEvidence === null && 
                        <>
                            <hr className="my-3"/>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <div className="flex justify-between w-full items-center">
                                    <div>
                                        <p className="text-gray-700 font-normal text-sm mb-0">Finish Payment Before</p>
                                        <p className="text-gray-700 font-bold text-sm">{formatDate(paymentDeadline,true)}</p>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/jpg,image/jpeg,image/png" className="hidden" onChange={handleEvidenceChange}/>
                                    <Button variant="outline" disabled={isUploading} onClick={handleClickUpload}>
                                        <UploadIcon className="w-4 h-4"/> {isUploading ? "Uploading..." : "Confirm Payment"}
                                    </Button>
                                </div>
                            </div>
                        </>
                }
                {
                    status === 'WAITING_PAYMENT' && paymentEvidence !== null && 
                        <>
                            <hr className="my-3"/>
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
                            <hr className="my-3"/>
                            <div className="bg-red-100 p-2 rounded-lg w-full">
                                <p className="text-gray-700 font-bold text-sm">We're sorry. But your transaction is rejected by our shop</p>
                                {evidenceElement(paymentEvidence??"")}
                            </div>
                        </>
                }
                <hr className="my-3"/>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <p className="text-gray-500 font-normal text-sm mb-0">Checkout At</p>
                        <p className="text-gray-500 font-bold text-sm">{formatDate(createdAt,false)}</p>
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