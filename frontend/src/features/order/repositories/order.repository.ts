import { apiFetch } from "@/utils/api"
import { ManagementOrderResponse, OrderData, OrderResponse, OrderSummaryByBranchIdData, OrderSummaryData } from "./order.type"

export const orderRepository = {
    async getOrderSummary(): Promise<OrderSummaryData> {
        return await apiFetch<OrderSummaryData>("/orders/summary","get")
    },
    async getOrderSummaryByBranchId(branchId: string): Promise<OrderSummaryByBranchIdData> {
        return await apiFetch<OrderSummaryByBranchIdData>(`/orders/summary/${branchId}`,"get")
    },
    async getAllOrders(page: number = 1, filters?: { orderNumber?: string, dateStart?: string, dateEnd?: string }): Promise<OrderResponse> {
        const params = new URLSearchParams({ page: String(page) })
        
        if (filters?.orderNumber) params.append("orderNumber", filters.orderNumber)
        if (filters?.dateStart) params.append("dateStart", filters.dateStart)
        if (filters?.dateEnd) params.append("dateEnd", filters.dateEnd)
        
        return await apiFetch<OrderResponse>(`/orders/transaction?${params.toString()}`,"get")
    },
    async getAllOrdersByBranchId(page: number = 1, branchId: string, status: string): Promise<ManagementOrderResponse> {
        return await apiFetch<ManagementOrderResponse>(`/orders/transaction/management/${branchId}?page=${page}&status=${status}`, "get")
    },
    async getOrderDetailByOrderNumber(orderNumber: string): Promise<OrderData> {
        return await apiFetch<OrderData>(`/orders/transaction/${orderNumber}`, "get")
    },
    async postUpdateOrderStatusById(orderNumber: string): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/orders/shipping/${orderNumber}`, "post")
    },
    async postCancelOrderStatusById(orderNumber: string): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/orders/cancelling/${orderNumber}`, "post")
    }
}