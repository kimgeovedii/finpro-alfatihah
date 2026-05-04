import { prisma } from "../../../config/prisma";

export class ProductDiscountRepository {
    async updateDiscountQuota(productId: string, quantity: number) {
        // Repo : find product discount by product id
        const productDiscount = await prisma.product_discounts.findFirst({
            where: { productId },
            select: {
                discountId: true,
                discount: {
                    select: {
                        quota: true
                    }
                }
            }
        })

        if (!productDiscount) return

        const currentQuota = productDiscount.discount?.quota
        if (currentQuota === null || currentQuota === undefined) return

        // Calculate new quota (prevent negative)
        const newQuota = Math.max(0, currentQuota - quantity)

        // Repo : update discount quota
        await prisma.discounts.update({
            where: { id: productDiscount.discountId },
            data: { quota: newQuota }
        })
    }
}