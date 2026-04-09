import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

class ProductDiscountsFactory {
    private async findRandomProduct() {
        const count = await prisma.products.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.products.findFirst({
            skip,
            select: { id: true }
        })
    }

    private async findRandomDiscount() {
        const count = await prisma.discounts.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.discounts.findFirst({
            skip,
            select: { id: true }
        })
    }

    public create = async (productId?: string, discountId?: string) => {
        // Use provided IDs or get random ones
        let targetProductId = productId
        let targetDiscountId = discountId

        if (!targetProductId) {
            const product = await this.findRandomProduct()
            if (!product) throw new Error('Cannot create product discount without product')
            targetProductId = product.id
        }

        if (!targetDiscountId) {
            const discount = await this.findRandomDiscount()
            if (!discount) throw new Error('Cannot create product discount without discount')
            targetDiscountId = discount.id
        }

        // Check if this product-discount combination already exists
        const existing = await prisma.product_discounts.findFirst({
            where: {
                productId: targetProductId,
                discountId: targetDiscountId
            }
        })

        if (existing) {
            return existing
        }

        return prisma.product_discounts.create({
            data: {
                id: faker.string.uuid(),
                productId: targetProductId,
                discountId: targetDiscountId,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdProductDiscounts = []
        for (let i = 0; i < count; i++) {
            const productDiscount = await this.create()
            createdProductDiscounts.push(productDiscount)
        }
        return createdProductDiscounts
    }

    // Link each discount to 5-15 random products
    public createForAllDiscounts = async () => {
        const discounts = await prisma.discounts.findMany({
            select: { id: true }
        })

        if (discounts.length === 0) {
            throw new Error('Cannot create product discounts without discounts')
        }

        const allProductDiscounts = []

        for (const discount of discounts) {
            // Each discount applies to 5-15 products
            const productCount = faker.number.int({ min: 5, max: 15 })

            for (let i = 0; i < productCount; i++) {
                const productDiscount = await this.create(undefined, discount.id)
                allProductDiscounts.push(productDiscount)
            }
        }

        return allProductDiscounts
    }
}

export default ProductDiscountsFactory
