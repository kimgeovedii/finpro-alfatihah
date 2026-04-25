import { prisma } from "../../../config/prisma"

export class CartItemRepository {
    async findByCartAndProduct(cartId: string, productId: string) {
        return await prisma.cart_items.findFirst({
            where: { cartId, productId }
        })
    }

    async findCartItemByProductIdBranchId(userId: string, productId: string, branchId: string) {
        return await prisma.cart_items.findFirst({
            where: { 
                cart: { userId },
                product: { branchId, productId }  
            },
            select: { quantity: true }
        })
    }

    async createCartItem(cartId: string, productId: string, quantity: number) {
        return await prisma.cart_items.create({
            data: { cartId, productId, quantity }
        })
    }

    async updateCartItemQuantity(id: string, quantity: number) {
        return await prisma.cart_items.update({
            where: { id },
            data: { quantity }
        })
    }

    async findById(cartItemId: string) {
        return await prisma.cart_items.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true, product: {
                    select: {
                        id: true, currentStock: true, branchId: true
                    }
                }
            }
        })
    }

    async deleteByCartId(cartId: string) {
        return await prisma.cart_items.deleteMany({
            where: { cartId }
        })
    }

    deleteCartItemById = async (id: string) => prisma.cart_items.delete({ where: { id } })
}