import { apiFetch } from "@/utils/api"
import { ManagementOrderResponse, OrderData, OrderResponse, OrderSummaryByBranchIdData, OrderSummaryData } from "./order.type"
import Cookies from "js-cookie";

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
    async getAllOrdersByBranchId(page: number = 1, branchId: string, status: string, search: string = ""): Promise<ManagementOrderResponse> {
        const params = new URLSearchParams({ page: String(page) })
    
        if (branchId) params.append("branchId", branchId)
        if (status && status !== "ALL") params.append("status", status)
        if (search) params.append("search", search)
    
        return await apiFetch<ManagementOrderResponse>(`/orders/transaction/management/${branchId}?${params.toString()}`, "get")
    },
    async getOrderDetailByOrderNumber(orderNumber: string): Promise<OrderData> {
        return await apiFetch<OrderData>(`/orders/transaction/${orderNumber}`, "get")
    },
    async postUpdateOrderStatusById(orderNumber: string): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/orders/shipping/${orderNumber}`, "post")
    },
    async postCancelOrderStatusById(orderNumber: string): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/orders/cancelling/${orderNumber}`, "post")
    },
    async postConfirmOrderStatusById(orderNumber: string): Promise<{ message: string }> {
        return await apiFetch<{ message: string }>(`/orders/confirming/${orderNumber}`, "post")
    },
    async downloadInvoiceOrder(orderNumber: string): Promise<Blob> {
        const token = Cookies.get("accessToken")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/export/invoice/${orderNumber}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return await res.blob()
    },
    async downloadTransactionHistoryDataset(): Promise<Blob> {
        const token = Cookies.get("accessToken")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/export/history`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return await res.blob()
    },
}