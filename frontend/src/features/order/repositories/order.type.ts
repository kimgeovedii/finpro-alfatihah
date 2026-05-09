import { OrderStatus } from "@/constants/business.const"
import { AddressData, BranchData } from "@/types/address.type"
import { PaginationMeta } from "@/types/global.type"
import { PaymentData } from "@/types/payment.type"
import { ProductOrderCartItem } from "@/types/product.type"

export type OrderItemProduct = {
    product: ProductOrderCartItem
    currentStock: number
}

export type OrderItem = {
    id: string
    quantity: number
    price: number
    product: OrderItemProduct
}

export type OrderData = {
    id: string
    orderNumber: string
    createdAt: string
    status: string
    totalPrice: number
    totalWeight: number
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
    distance: number
    items: OrderItem[]
}

export type OrderResponse = {
    data: OrderData[]
    meta: PaginationMeta
}

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
    branch: BranchData
    orderNumber: string
    createdAt: string
    status: string
    finalPrice: number
    payments: PaymentData[]
    user: ManagementOrderUser
}

export type OrderTableItem = {
    id: string
    storeName: string
    slug: string
    orderNumber: string
    customerName: string
    customerEmail: string
    createdAt: string
    finalPrice: number
    status: OrderStatus
    payments: PaymentData[]
}

export type ManagementOrderResponse = {
    data: ManagementOrderItem[]
    meta: PaginationMeta
}