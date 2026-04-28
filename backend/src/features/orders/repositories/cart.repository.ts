import { prisma } from "../../../config/prisma"

export class CartRepository {
    async findCartWithItemsById(cartId: string) {
        return await prisma.carts.findFirst({
            where: { id: cartId },
            select: {
                id: true, userId: true, branchId: true, items: {
                    select: {
                        id: true, quantity: true, discountId: true,
                        product: {                      
                            select: {
                                id: true, product: {              
                                    select: {
                                        basePrice: true, weight: true
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