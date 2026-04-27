export type ProductImage = {
    imageUrl: string
}

export type ProductItem = {
    slugName: string
    productName: string
    basePrice: number
    description: string
    productImages: ProductImage[]
}

export type ProductOrderCartItem = {
    id: string
    branchInventoriesId?: string
    currentStock?: number
    productName: string
    slugName: string
    description: string
    category: ProductCategory
    productImages: ProductImage[]
    quantity: number
    weight: number
    basePrice: number
    totalPrice: number
}

export type ProductCategory = {
    name: string
}