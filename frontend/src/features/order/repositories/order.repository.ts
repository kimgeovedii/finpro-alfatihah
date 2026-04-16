import { apiFetch } from "@/utils/api"

export type PaymentData = {
    evidence?: string
    method: string
    status: string
}

export type OrderData = {
    id: string
    orderNumber: string
    createdAt: string
    status: string
    totalPrice: number
    finalPrice: number
    shippingCost: number
    paymentDeadline: string
    totalItems: number
    productList: string
    payments: PaymentData[]
}

export type OrderMeta = {
    page: number
    limit: number
    total: number
    total_page: number
}

export type OrderResponse = {
    data: OrderData[]
    meta: OrderMeta
}

export type OrderStatus = "WAITING_PAYMENT" | "WAITING_PAYMENT_CONFIRMATION" | "PROCESSING" | "SHIPPED" | "CONFIRMED" | "CANCELLED"
export type OrdersByStatus = Partial<Record<OrderStatus, number>>
export type OrderSummaryData = {
    ordersByStatus: OrdersByStatus
    totalFinalPrice: number
    totalPrice: number
}

export const orderRepository = {
    async getOrderSummary(): Promise<OrderSummaryData> {
        return await apiFetch<OrderSummaryData>("/orders/summary","get")
    },
    async getAllOrders(page: number = 1): Promise<OrderResponse> {
        return await apiFetch<any>(`/orders/transaction?page=${page}`, "get")
    }
}