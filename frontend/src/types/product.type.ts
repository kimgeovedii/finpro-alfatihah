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

export type ProductCategory = {
    name: string
}