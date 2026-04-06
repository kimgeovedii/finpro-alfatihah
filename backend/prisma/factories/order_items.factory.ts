import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

import { OrderRepository } from "../../src/features/orders/repositories/order.repository"

class OrderItemsFactory {
    private orderRepository: OrderRepository

    constructor(){
        this.orderRepository = new OrderRepository()
    }

    public create = async () => {
        // Get random order from repo
        const order = await this.orderRepository.findRandomOrder()
        if (!order) throw new Error('Cannot create order items without order')

        return prisma.order_items.create({
            data: {
                id: faker.string.uuid(),
                orderId: order.id,
                price: faker.number.int({ min: 50000, max: 400000 }), // for now
                quantity: faker.number.int({ min: 1, max: 5 })
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
