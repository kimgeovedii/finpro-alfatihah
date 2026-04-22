import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/converter.util"
import { UploadIcon } from "lucide-react"
import React, { useRef } from "react"
import { useUploadPaymentEvidence } from "../hooks/usePayment"
import Swal from "sweetalert2"
import { allowedMimeTypesPaymentEvidence, maxSizePaymentEvidence, statusColorMap } from "@/constants/business.const"

type Props = {
    orderId: string
    paymentDeadline: string
}

export const PaymentEvidenceUploadButton: React.FC<Props> = ({ orderId, paymentDeadline }) => {
    // For file handling
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadEvidence, isUploading } = useUploadPaymentEvidence()

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

    const handleClickUpload = () => fileInputRef.current?.click()

    return (
        <div className="bg-orange-100 p-2 rounded-lg w-full">
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
    )
}