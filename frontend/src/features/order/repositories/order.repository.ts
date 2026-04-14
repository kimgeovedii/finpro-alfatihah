import { apiFetch } from "@/utils/api"

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

export const orderRepository = {
    async getAllOrders(page: number = 1): Promise<OrderResponse> {
        return await apiFetch<any>(`/orders/transaction?page=${page}`, "get")
    }
}