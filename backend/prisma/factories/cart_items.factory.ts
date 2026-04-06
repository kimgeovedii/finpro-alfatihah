import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

import { CartRepository } from "../../src/features/carts/repositories/cart.repository"

class CartItemsFactory {
    private cartRepository: CartRepository

    constructor(){
        this.cartRepository = new CartRepository()
    }

    public create = async () => {
        // Get random cart from repo
        const cart = await this.cartRepository.findRandomCart()
        if (!cart) throw new Error('Cannot create cart items without cart')

        return prisma.cart_items.create({
            data: {
                id: faker.string.uuid(),
                cartId: cart.id,
                quantity: faker.number.int({ min: 1, max: 5 }),
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        for (let i = 0; i < count; i++) {
            await this.create()
        }
    }
}

export default CartItemsFactory
