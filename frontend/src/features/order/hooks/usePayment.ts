import { useState } from "react"
import { paymentRepository } from "../repositories/payment.repository"
import { closeLoading, showLoading } from "@/utils/message.util"

export const useUploadPaymentEvidence = () => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadEvidence = async (orderId: string, img: File): Promise<{ message: string, success: boolean }> => {
        setIsUploading(true)
        try {
            // Repo : Post payment evidence file
            showLoading("Uploading evidence...")
            const res = await paymentRepository.uploadPaymentEvidence(orderId, img)
            closeLoading()

            return { message: res.message, success: true }
        } catch (err: any) {
            return { message: err.message || "Failed to upload evidence", success: false }
        } finally {
            setIsUploading(false)
        }
    }

    return { uploadEvidence, isUploading }
}

export const useUpdatePaymentStatusById = () => {
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
    const [errorUpdatePayment, setError] = useState<string | null>(null)

    const updatePayment = async (paymentId: string, isConfirm: boolean): Promise<boolean> => {
        setIsUpdatingPayment(true)
        setError(null)

        try {
            // Repo : Update payment status
            showLoading("Updating payment...")
            await paymentRepository.putUpdatePaymentStatusById(paymentId, isConfirm)
            closeLoading()

            return true
        } catch (err: any) {
            setError(err.message || "Failed to update payment")
            return false
        } finally {
            setIsUpdatingPayment(false)
        }
    }

    return { updatePayment, isUpdatingPayment, errorUpdatePayment }
}