import { PaginationMeta } from "@/types/global"
import { Schedule } from "@/types/schedule"
import { apiFetch } from "@/utils/api"

export type PaymentData = {
    id: string
    evidence?: string
    method: string
    status: string
}

export type BranchData = {
    id: string
    storeName: string
    address: string
    city: string
    schedules: Schedule[]
}

export type AddressData = {
    label: string
    type: string
    receiptName: string
    notes: string
    phone: string
    address: string
}

export type ProductImage = {
    imageUrl: string
}

export type ProductDetail = {
    productName: string
    description: string
    basePrice: number
    productImages: ProductImage[]
}

export type OrderItemProduct = {
    product: ProductDetail
}

export type OrderItem = {
    id: string
    quantity: number
    product: OrderItemProduct
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
    shippedAt: string | null
    confirmedAt: string | null
    rejectedAt: string | null
    branch: BranchData
    address: AddressData
    items: OrderItem[]
}

export type OrderResponse = {
    data: OrderData[]
    meta: PaginationMeta
}

export type OrderStatus = "WAITING_PAYMENT" | "WAITING_PAYMENT_CONFIRMATION" | "PROCESSING" | "SHIPPED" | "CONFIRMED" | "CANCELLED"
export type OrdersByStatus = Partial<Record<OrderStatus, number>>
export type OrderSummaryData = {
    ordersByStatus: OrdersByStatus
    totalFinalPrice: number
    totalPrice: number
}
export type OrderSummaryByBranchIdData = {
    totalRevenue: number 
    revenueChangePercent: number 
    activeShipments: number 
    processingOrder: number
    finishedOrder: number 
    finishedOrderLastMonth: number
}

export type ManagementOrderUser = {
    username: string
    email: string
}

export type ManagementOrderItem = {
    id: string
    orderNumber: string
    createdAt: string
    status: string
    finalPrice: number
    payments: PaymentData[]
    user: ManagementOrderUser
}

export type ManagementOrderResponse = {
    data: ManagementOrderItem[]
    meta: {
        page: number
        limit: number
        total: number
        total_page: number
    }
}

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