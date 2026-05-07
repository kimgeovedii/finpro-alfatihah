import { OrderStatus } from "@/constants/business.const"
import { useUpdatePaymentStatusById } from "@/features/order/hooks/usePayment"
import { useOrderManagement } from "@/features/order/hooks/useManageOrder"
import { showPopUp } from "@/utils/message.util"
import { OrderTableItem } from "@/features/order/components/OrderManagementTable"
import Swal from "sweetalert2"
import { useCancelOrderStatusById, useUpdateOrderStatusById } from "./useOrder"
import { closeAllDialogs } from "@/utils/dialog"

export const useManageOrderActions = (onSuccess?: () => void) => {
    // Call hook
    const { orders, meta, isLoading, status, setStatus, setPage, branchId, setBranchId, search, setSearch, fetchOrders } = useOrderManagement()
    const { updatePayment, isUpdatingPayment } = useUpdatePaymentStatusById()
    const { updateOrder, isUpdatingOrder } = useUpdateOrderStatusById()
    const { cancelOrder, isCancellingOrder } = useCancelOrderStatusById()

    // Page change
    const handlePageChange = (nextPage: number) => setPage(nextPage)

    // Status filter change
    const handleStatusChange = (nextStatus: OrderStatus | "ALL") => {
        setPage(1)
        setStatus(nextStatus)
    }

    // Branch filter change
    const handleBranchChange = (nextBranchId: string) => {
        setPage(1)
        setBranchId(nextBranchId)
    }

    // Search change
    const handleSearchChange = (nextSearch: string) => {
        setPage(1)
        setSearch(nextSearch)
    }

    // Validate payment evidence
    const handleValidatePaymentEvidence = async (paymentId: string, isConfirm: boolean) => {
        closeAllDialogs()

        const confirm = await Swal.fire({
            title: "Validate transaction?",
            text: `Are you sure want to ${isConfirm ? 'confirm' : 'reject'} this transaction?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2d766f",
        })
        if (!confirm.isConfirmed) return

        const success = await updatePayment(paymentId, isConfirm)
        if (success) await showPopUp("Order validated!", "Your customer will receive notification as soon as possible", "success")
    }

    // Ship order
    const handleShippingOrder = async (orderNumber: string) => {
        const confirm = await Swal.fire({
            title: "Order Shipping",
            text: `Are you sure want to shipping this order?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2d766f",
        })
        if (!confirm.isConfirmed) return

        const { success, message } = await updateOrder(orderNumber)
        await Swal.fire({
            title: success ? "Order shipped!" : "Opps!",
            text: message,
            icon: success ? "success" : "error",
            confirmButtonColor: "#10b981",
        })
        if (success) onSuccess?.()
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

    // Map orders to table format
    const tableOrders: OrderTableItem[] = orders.map(dt => ({
        id: dt.id,
        orderNumber: dt.orderNumber,
        storeName: dt.branch.storeName,
        customerName: dt.user.username,
        customerEmail: dt.user.email,
        createdAt: dt.createdAt,
        finalPrice: dt.finalPrice,
        payments: dt.payments,
        status: dt.status as OrderStatus,
    }))

    return {
        branchId, setBranchId: handleBranchChange,
        search, setSearch: handleSearchChange,
        tableOrders, meta, isLoading,
        status, handlePageChange, handleStatusChange,
        isUpdatingPayment, isUpdatingOrder, isCancellingOrder,
        handleValidatePaymentEvidence,
        handleShippingOrder, handleCancelOrder,
    }
}