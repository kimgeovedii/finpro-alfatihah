import { useState } from "react"
import { orderRepository } from "../repositories/order.repository"

export const useDownloadInvoice = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const downloadInvoiceOrder = async (orderNumber: string) => {
        setIsDownloading(true)

        try {
            const blob = await orderRepository.downloadInvoiceOrder(orderNumber)

            const url = window.URL.createObjectURL(blob)
            window.open(url, "_blank")

            setTimeout(() => URL.revokeObjectURL(url), 5000)
        } catch (err) {
            console.error("Failed to download invoice", err)
        } finally {
            setIsDownloading(false)
        }
    }

    return { downloadInvoiceOrder, isDownloading }
}

export const useDownloadTransactionHistory = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const downloadTransactionHistory = async () => {
        setIsDownloading(true)

        try {
            const blob = await orderRepository.downloadTransactionHistoryDataset()

            const url = window.URL.createObjectURL(blob)
            window.open(url, "_blank")

            setTimeout(() => URL.revokeObjectURL(url), 5000)
        } catch (err) {
            console.error("Failed to download invoice", err)
        } finally {
            setIsDownloading(false)
        }
    }

    return { downloadTransactionHistory, isDownloading }
}