import { OrderStatus } from "@/constants/business.const"
import { AddressData } from "@/types/address.type"
import { PaginationMeta } from "@/types/global.type"
import { PaymentData } from "@/types/payment.type"
import { ProductImage } from "@/types/product.type"
import { Schedule } from "@/types/schedule.type"

export type BranchData = {
    id: string
    storeName: string
    address: string
    city: string
    schedules: Schedule[]
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
    meta: PaginationMeta
}