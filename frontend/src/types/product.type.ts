export type ProductImage = {
    imageUrl: string
}

export type ProductItem = {
    productName: string
    basePrice: number
    description: string
    productImages: ProductImage[]
}

export type ProductCategory = {
    name: string
}