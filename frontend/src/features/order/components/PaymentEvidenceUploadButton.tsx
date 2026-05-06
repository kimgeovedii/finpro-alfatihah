import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/converter.util"
import React, { useRef } from "react"
import { useUploadPaymentEvidence } from "../hooks/usePayment"
import Swal from "sweetalert2"
import { allowedMimeTypesPaymentEvidence, maxSizePaymentEvidence } from "@/constants/business.const"
import { showPopUp } from "@/utils/message.util"
import { CloudIcon } from "@heroicons/react/24/outline"

type Props = {
    orderId: string
    paymentDeadline: string
    onSuccess: () => void
}

export const PaymentEvidenceUploadButton: React.FC<Props> = ({ orderId, paymentDeadline, onSuccess }) => {
    // For file handling
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadEvidence, isUploading } = useUploadPaymentEvidence()

    const handleEvidenceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validation file type
        if (!allowedMimeTypesPaymentEvidence.includes(file.type)) {
            showPopUp("Upload failed", "Only JPG, JPEG, PNG, and GIF files are allowed.", "error")
            return
        }

        // Validation size
        if (file.size > maxSizePaymentEvidence) {
            showPopUp("Upload failed", "File size must not exceed 10 MB.", "error")
            return
        }

        Swal.fire({ title: "Uploading...", allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        const result = await uploadEvidence(orderId, file)

        Swal.fire({ 
            icon: result.success ? "success" : "error", 
            title: result.success ? result.message : "Upload failed", 
            text: result.message, 
            confirmButtonColor: result.success ? "#10b981" : "#ef4444" 
        }).then(() => {
            if (result.success) onSuccess()
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
                    <CloudIcon className="w-4 h-4"/> {isUploading ? "Uploading..." : "Confirm Payment"}
                </Button>
            </div>
        </div>
    )
}