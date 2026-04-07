import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { ProductRepository } from "../../src/features/products/repositories/product.repository"
import { CartRepository } from "../../src/features/carts/repositories/cart.repository"

class CartItemsFactory {
    private cartRepository: CartRepository
    private productRepository: ProductRepository

    constructor(){
        this.cartRepository = new CartRepository()
        this.productRepository = new ProductRepository()
    }

    public create = async () => {
        // Get random cart from repo
        const cart = await this.cartRepository.findRandomCart()
        if (!cart) throw new Error('Cannot create cart items without cart')

        // Get random product from repo
        const product = await this.productRepository.findRandomProduct(cart.branchId)
        if (!product) throw new Error('Cannot create cart items without products')

        return prisma.cart_items.create({
            data: {
                id: faker.string.uuid(),
                cartId: cart.id,
                productId: product.id,
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
