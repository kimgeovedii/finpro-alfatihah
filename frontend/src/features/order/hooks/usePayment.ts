import { useState } from "react"
import { paymentRepository } from "../repositories/payment.repository"

export const useUploadPaymentEvidence = () => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadEvidence = async (orderId: string, img: File): Promise<{ message: string, success: boolean }> => {
        setIsUploading(true)
        try {
            console.log(img)
            const res = await paymentRepository.uploadPaymentEvidence(orderId, img)
            return { message: res.message, success: true }
        } catch (err: any) {
            return { message: err.message || "Failed to upload evidence", success: false }
        } finally {
            setIsUploading(false)
        }
    }

    return { uploadEvidence, isUploading }
}