import { useDownloadTransactionHistory } from "@/features/order/hooks/useExport"
import { useCancelOrderStatusById, useConfirmOrderStatusById } from "@/features/order/hooks/useOrder"
import { showPopUp } from "@/utils/message.util"
import { useState } from "react"
import Swal from "sweetalert2"

export const useOrderActions = (
    fetchAllOrders: (page: number, filters?: { orderNumber?: string, dateStart?: string, dateEnd?: string }) => void,
    onSuccess?: () => void
) => {
    // Handle hook
    const { downloadTransactionHistory } = useDownloadTransactionHistory()
    const { cancelOrder, isCancellingOrder } = useCancelOrderStatusById()
    const { confirmOrder, isConfirmingOrder } = useConfirmOrderStatusById()

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

    // Cancel order
    const handleCancelOrder = async (orderNumber: string) => {
        const confirm = await Swal.fire({
            title: "Order Rejection",
            text: `Are you sure want to cancel this order?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2d766f",
        })
        if (!confirm.isConfirmed) return

        const { success, message } = await cancelOrder(orderNumber)
        await Swal.fire({
            title: success ? "Order cancel!" : "Opps!",
            text: message,
            icon: success ? "success" : "error",
            confirmButtonColor: "#10b981",
        })
        if (success) onSuccess?.()
    }

    // Confirm order
    const handleConfirmOrder = async (orderNumber: string) => {
        const confirm = await Swal.fire({
            title: "Order Confirmation",
            text: `Are you sure want to confirm this order?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2d766f",
        })
        if (!confirm.isConfirmed) return

        const { success, message } = await confirmOrder(orderNumber)
        await Swal.fire({
            title: success ? "Order confirm!" : "Opps!",
            text: message,
            icon: success ? "success" : "error",
            confirmButtonColor: "#10b981",
        })
        if (success) onSuccess?.()
    }

    return {
        orderNumber, setOrderNumber,
        dateStart, setDateStart,
        dateEnd, setDateEnd,
        handleSearch,
        downloadTransactionHistory,
        isCancellingOrder, isConfirmingOrder,
        handleCancelOrder, handleConfirmOrder,
    }
}