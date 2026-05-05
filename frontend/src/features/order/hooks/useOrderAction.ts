import { useDownloadTransactionHistory } from "@/features/order/hooks/useExport"
import { showPopUp } from "@/utils/message.util"
import { useState } from "react"

export const useOrderActions = (fetchAllOrders: (page: number, filters?: { orderNumber?: string, dateStart?: string, dateEnd?: string }) => void) => {
    // Call hook
    const { downloadTransactionHistory } = useDownloadTransactionHistory()

    // Filter state
    const [orderNumber, setOrderNumber] = useState("")
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")

    // Search order with filter
    const handleSearch = () => {
        if ((dateStart && !dateEnd) || (!dateStart && dateEnd)) {
            showPopUp("Filter failed", "date start and date end must be provided together", "error")
            return
        }

        fetchAllOrders(1, {
            orderNumber: orderNumber || undefined,
            dateStart: dateStart || undefined,
            dateEnd: dateEnd || undefined,
        })
    }

    return {
        orderNumber, setOrderNumber,
        dateStart, setDateStart,
        dateEnd, setDateEnd,
        handleSearch,
        downloadTransactionHistory,
    }
}