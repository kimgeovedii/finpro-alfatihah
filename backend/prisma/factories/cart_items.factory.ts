import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { BranchInventoryRepository } from "../../src/features/branch/repositories/branch_inventory.repository"
import { CartRepository } from "../../src/features/carts/repositories/cart.repository"

class CartItemsFactory {
    private cartRepository: CartRepository
    private branchInventoryRepository: BranchInventoryRepository

    constructor(){
        this.cartRepository = new CartRepository()
        this.branchInventoryRepository = new BranchInventoryRepository()
    }

    public create = async () => {
        // Get random cart from repo
        const cart = await this.cartRepository.findRandomCart()
        if (!cart) throw new Error('Cannot create cart items without cart')

        // Get random product (branch inventory) from repo
        const branchInventory = await this.branchInventoryRepository.findRandomBranchInventory(cart.branchId)
        if (!branchInventory) throw new Error('Cannot create cart items without branch inventory')

        return prisma.cart_items.create({
            data: {
                id: faker.string.uuid(),
                cartId: cart.id,
                productId: branchInventory.id,
                quantity: faker.number.int({ min: 1, max: branchInventory.currentStock }),
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
