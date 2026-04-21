import { apiFetch } from "@/utils/api"
import { ManagementOrderResponse, OrderData, OrderResponse, OrderSummaryByBranchIdData, OrderSummaryData } from "./order.type"

export const orderRepository = {
    async getOrderSummary(): Promise<OrderSummaryData> {
        return await apiFetch<OrderSummaryData>("/orders/summary","get")
    },
    async getOrderSummaryByBranchId(branchId: string): Promise<OrderSummaryByBranchIdData> {
        return await apiFetch<OrderSummaryByBranchIdData>(`/orders/summary/${branchId}`,"get")
    },
    async getAllOrders(page: number = 1): Promise<OrderResponse> {
        return await apiFetch<OrderResponse>(`/orders/transaction?page=${page}`, "get")
    },
    async getAllOrdersByBranchId(page: number = 1, branchId: string, status: string): Promise<ManagementOrderResponse> {
        return await apiFetch<ManagementOrderResponse>(`/orders/transaction/management/${branchId}?page=${page}&status=${status}`, "get")
    },
    async getOrderDetailByOrderNumber(orderNumber: string): Promise<OrderData> {
        return await apiFetch<OrderData>(`/orders/transaction/${orderNumber}`, "get")
    }
}