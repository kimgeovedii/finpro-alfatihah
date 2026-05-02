import { DiscountType, DiscountValueType } from "@/features/manageDiscounts/types/discount.type"

export type ProductImage = {
    imageUrl: string
}

export type ProductItem = {
    slugName: string
    productName: string
    basePrice: number
    productImages: ProductImage[]
}

export type CartItemDiscount = {
    discountType: DiscountType
    discountValueType: DiscountValueType
    discountValue: number 
    maxDiscountAmount?: number
    minPurchaseAmount?: number
    startDate: string 
    endDate: string
}

export type ProductDiscounts = {
    discount: CartItemDiscount
}

export type ProductOrderCartItem = {
    id: string
    branchInventoriesId?: string
    currentStock?: number
    productName: string
    slugName: string
    category: ProductCategory
    productImages: ProductImage[]
    quantity: number
    weight: number
    basePrice: number
    totalPrice: number
    productDiscounts: ProductDiscounts[]
    discountAmount: number
    finalTotalPrice: number
    finalPricePerItem: number
}

export type ProductCategory = {
    name: string
}