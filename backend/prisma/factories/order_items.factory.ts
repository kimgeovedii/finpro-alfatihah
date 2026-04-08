import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { OrderRepository } from "../../src/features/orders/repositories/order.repository"
import { BranchInventoryRepository } from "../../src/features/branch/repositories/branch_inventory.repository"

class OrderItemsFactory {
    private orderRepository: OrderRepository
    private branchInventoryRepository: BranchInventoryRepository

    constructor(){
        this.orderRepository = new OrderRepository()
        this.branchInventoryRepository = new BranchInventoryRepository()
    }

    public create = async () => {
        // Get random order from repo
        const order = await this.orderRepository.findRandomOrder()
        if (!order) throw new Error('Cannot create order items without order')

        // Get random product (branch inventory) from repo
        const branchInventory = await this.branchInventoryRepository.findRandomBranchInventory(order.branchId)
        if (!branchInventory) throw new Error('Cannot create cart items without branch inventory')

        const quantity = faker.number.int({ min: 1, max: branchInventory.currentStock })

        return prisma.order_items.create({
            data: {
                id: faker.string.uuid(),
                orderId: order.id,
                productId: branchInventory.id,
                price: quantity * branchInventory.product.basePrice, 
                quantity
            },
        })
    }

    public createMany = async (count: number) => {
        for (let i = 0; i < count; i++) {
            await this.create()
        }
    }
}

export default OrderItemsFactory
