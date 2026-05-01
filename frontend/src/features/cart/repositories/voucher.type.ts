import { PaginationMeta } from "@/types/global.type"

export interface VoucherData {
    id: string
    name: string
    voucherCode: string
    type: "ORDER" | "SHIPPING_COST"
    discountValueType: "PERCENTAGE" | "NOMINAL"
    discountValue: number
    minPurchaseAmount: number | null
    maxDiscountAmount: number
    quota: number
    expiredDate: string
    createdAt: string
}

export interface VoucherResponse {
    data: VoucherData[]
    meta: PaginationMeta
}