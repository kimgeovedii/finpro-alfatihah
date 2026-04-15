import { create } from "zustand"
import { orderRepository, OrderSummaryData } from "../repositories/order.repository"

type OrderState = {
    summary: OrderSummaryData | null
    isLoadingSummary: boolean
    error: string | null

    fetchOrderSummary: () => Promise<void>
}

export const useOrderService = create<OrderState>((set) => ({
    summary: null,
    isLoadingSummary: false,
    error: null,

    fetchOrderSummary: async () => {
        set({ isLoadingSummary: true, error: null })

        try {
            const data = await orderRepository.getOrderSummary()

            set({ summary: data, isLoadingSummary: false })
        } catch (err: any) {
            set({
                error: err.message || "Failed to fetch order summary",
                isLoadingSummary: false,
            })
        }
    }
}))