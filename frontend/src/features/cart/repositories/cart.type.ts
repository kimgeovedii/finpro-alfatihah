import { AddressData, BranchData } from "@/types/address.type"
import { PaginationMeta } from "@/types/global.type"
import { ProductDiscounts, ProductImage, ProductItem } from "@/types/product.type"
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

export type CartBasedAddress = {
    id: string
    branchId: string
    branch: BranchData
    items: CartItem[]
    distance?: number
}

// Cart Detail
export type CartDetailCategory = {
    name: string
    slugName: string
}

export type CartDetailProduct = {
    slugName: string
    productName: string
    basePrice: number
    weight: number
    category: CartDetailCategory
    productDiscounts: ProductDiscounts[]
    productImages: ProductImage[]
    discountAmount: number
    finalTotalPrice: number
    finalPricePerItem: number
}

export type CartDetailItem = {
    id: string
    quantity: number
    product: {
        product: CartDetailProduct
        currentStock: number
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
    totalWeight: number
    totalQty: number
    totalDiscountProduct: number
    finalTotalPrice: number
    shipping: CartDetailShipping | null
    openStatus: string
}