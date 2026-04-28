import { useState } from "react"
import { orderRepository } from "../repositories/order.repository"

export const useDownloadInvoice = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const downloadInvoice = async (orderNumber: string) => {
        setIsDownloading(true)

        try {
            const blob = await orderRepository.downloadInvoice(orderNumber)

            const url = window.URL.createObjectURL(blob)
            window.open(url, "_blank")

            setTimeout(() => URL.revokeObjectURL(url), 5000)
        } catch (err) {
            console.error("Failed to download invoice", err)
        } finally {
            setIsDownloading(false)
        }
    }

    return { downloadInvoice, isDownloading }
}