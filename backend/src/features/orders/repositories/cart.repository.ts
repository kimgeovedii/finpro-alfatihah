import { prisma } from "../../../config/prisma"

export class CartRepository {
    async findCartWithItemsById(cartId: string) {
        return await prisma.carts.findFirst({
            where: { id: cartId },
            select: {
                id: true, userId: true, branchId: true, items: {
                    select: {
                        id: true, quantity: true,
                        product: {                      
                            select: {
                                id: true, product: {              
                                    select: {
                                        basePrice: true, weight: true, productDiscounts: {
                                            take: 1,
                                            select: {
                                                discount: {
                                                    select: {
                                                        discountType: true, discountValue: true, discountValueType: true, maxDiscountAmount: true, minPurchaseAmount: true, startDate: true, endDate: true,
                                                    }
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    deleteCart = async (id: string) => prisma.carts.delete({ where: { id } })
}