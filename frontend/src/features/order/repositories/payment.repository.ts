import { apiFetch } from "@/utils/api"

export const paymentRepository = {
    async uploadPaymentEvidence(orderId: string, img: File): Promise<{ message: string }> {
        const formData = new FormData()
        formData.append("img", img)

        return await apiFetch<{ message: string }>(`/payments/manual/evidence/${orderId}`, "post", formData)
    },
    async putUpdatePaymentStatusById(paymentId: string, isConfirm: boolean): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/payments/manual/${paymentId}`, "put", { isConfirm })
    }
}