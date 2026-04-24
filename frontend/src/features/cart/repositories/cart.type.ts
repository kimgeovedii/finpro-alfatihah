import { AddressData, BranchData } from "@/types/address.type"
import { PaginationMeta } from "@/types/global.type"
import { ProductImage, ProductItem } from "@/types/product.type"
import { Schedule } from "@/types/schedule.type"

export type CartSummaryData = {
    totalItems: number
    totalQty: number
}

export type CartItem = {
    id: string
    quantity: number
    product: {
        id: string
        currentStock: number
        product: ProductItem
    }
}

export type CartBranch = {
    id: string
    branchId: string
    branch: BranchData
    items: CartItem[]
}

export type CartResponse = {
    data: CartBranch[]
    meta: PaginationMeta
}

// Cart Detail
export type CartDetailCategory = {
    id: string
    name: string
    slugName: string
    description: string
    createdAt: string
    updatedAt: string
}

export type CartDetailProduct = {
    productName: string
    description: string
    basePrice: number
    category: CartDetailCategory
    productImages: ProductImage[]
}

export type CartDetailItem = {
    id: string
    quantity: number
    product: {
        product: CartDetailProduct
    }
}

export type CartDetailBranch = {
    storeName: string
    latitude: number
    longitude: number
    address: string
    maxDeliveryDistance: number
    schedules: Schedule[]
}

export type CartDetailShipping = {
    shippingCost: number
    distance: number
    courier: string
}

export type CartData = {
    branch: CartDetailBranch
    items: CartDetailItem[]
    user: {
        addresses: AddressData[]
    }
    totalBasePrice: number
    totalQty: number
    shipping: CartDetailShipping | null
    openStatus: string
}