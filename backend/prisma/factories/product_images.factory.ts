import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

class ProductImagesFactory {
    private async findRandomProduct() {
        const count = await prisma.products.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.products.findFirst({
            skip,
            select: { id: true, productName: true }
        })
    }

    public create = async (productId?: string) => {
        // Use provided productId or get random product
        let targetProductId = productId
        if (!targetProductId) {
            const product = await this.findRandomProduct()
            if (!product) throw new Error('Cannot create product image without product')
            targetProductId = product.id
        }

        // Generate realistic image URL using faker
        const imageUrl = faker.image.url({
            width: 800,
            height: 600
        })

        // For simplicity, set first image as primary, others as secondary
        // In a real scenario, you'd check existing images for the product
        const isPrimary = Math.random() < 0.3 // 30% chance of being primary

        return prisma.product_images.create({
            data: {
                id: faker.string.uuid(),
                productId: targetProductId,
                imageUrl,
                isPrimary,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdImages = []
        for (let i = 0; i < count; i++) {
            const image = await this.create()
            createdImages.push(image)
        }
        return createdImages
    }

    // Create multiple images for a specific product
    public createForProduct = async (productId: string, count: number = 3) => {
        const createdImages = []
        let hasPrimary = false

        for (let i = 0; i < count; i++) {
            // Ensure at least one primary image per product
            const forcePrimary = !hasPrimary && i === count - 1
            const isPrimary = forcePrimary || Math.random() < 0.4

            if (isPrimary) hasPrimary = true

            const imageUrl = faker.image.url({
                width: 800,
                height: 600
            })

            const image = await prisma.product_images.create({
                data: {
                    id: faker.string.uuid(),
                    productId,
                    imageUrl,
                    isPrimary,
                    createdAt: faker.date.past({ years: 1 }),
                },
            })
            createdImages.push(image)
        }
        return createdImages
    }

    // Create images for all products (1-4 images per product)
    public createForAllProducts = async () => {
        const products = await prisma.products.findMany({
            select: { id: true, productName: true }
        })

        const allImages = []
        for (const product of products) {
            // Each product gets 1-4 random images
            const imageCount = faker.number.int({ min: 1, max: 4 })
            const productImages = await this.createForProduct(product.id, imageCount)
            allImages.push(...productImages)
        }
        return allImages
    }
}

export default ProductImagesFactory
