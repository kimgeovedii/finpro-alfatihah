import { create } from "zustand"
import { orderRepository } from "../repositories/order.repository"
import { OrderSummaryByBranchIdData, OrderSummaryData } from "../repositories/order.type"
import { closeLoading, showLoading } from "@/utils/message.util"

type OrderState = {
    summary: OrderSummaryData | null
    isLoadingSummary: boolean
    error: string | null
    summaryByBranchId: OrderSummaryByBranchIdData | null
    isLoadingSummaryByBranchId: boolean
    errorByBranchId: string | null

    fetchOrderSummary: () => Promise<void>
    fetchOrderSummaryByBranchId: (branchId: string) => Promise<void>
}

export const useOrderService = create<OrderState>((set) => ({
    // Get order summary (Customer)
    summary: null,
    isLoadingSummary: false,
    error: null,
    // Get order summary by branch (shop admin)
    summaryByBranchId: null,
    isLoadingSummaryByBranchId: false,
    errorByBranchId: null,

    fetchOrderSummaryByBranchId: async (branchId: string) => {
        set({ isLoadingSummaryByBranchId: true, errorByBranchId: null })

        try {
            // Repo : Get order summary by branch id
            showLoading("Loading...")
            const data = await orderRepository.getOrderSummaryByBranchId(branchId)
            closeLoading()

            set({ summaryByBranchId: data, isLoadingSummaryByBranchId: false })
        } catch (err: any) {
            set({
                errorByBranchId: err.message || "Failed to fetch order summary",
                isLoadingSummaryByBranchId: false,
            })
        }
    },

    fetchOrderSummary: async () => {
        set({ isLoadingSummary: true, error: null })

        try {
            // Repo : get order summary
            showLoading("Loading...")
            const data = await orderRepository.getOrderSummary()
            closeLoading()

            set({ summary: data, isLoadingSummary: false })
        } catch (err: any) {
            set({
                error: err.message || "Failed to fetch order summary",
                isLoadingSummary: false,
            })
        }
    }
}))