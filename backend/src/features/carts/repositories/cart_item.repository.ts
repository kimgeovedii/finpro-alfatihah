import { prisma } from "../../../config/prisma"

export class CartItemRepository {
    async findByCartAndProduct(cartId: string, productId: string) {
        return prisma.cart_items.findFirst({
            where: { cartId, productId }
        })
    }

    async createCartItem(cartId: string, productId: string, quantity: number) {
        return prisma.cart_items.create({
            data: { cartId, productId, quantity }
        })
    }

    async updateCartItemQuantity(id: string, quantity: number) {
        return prisma.cart_items.update({
            where: { id },
            data: { quantity }
        })
    }
}