import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

import { OrderRepository } from "../../src/features/orders/repositories/order.repository"
import { ProductRepository } from "../../src/features/products/repositories/product.repository"

class OrderItemsFactory {
    private orderRepository: OrderRepository
    private productRepository: ProductRepository

    constructor(){
        this.orderRepository = new OrderRepository()
        this.productRepository = new ProductRepository()
    }

    public create = async () => {
        // Get random order from repo
        const order = await this.orderRepository.findRandomOrder()
        if (!order) throw new Error('Cannot create order items without order')

        // Get random product from repo
        const product = await this.productRepository.findRandomProduct(order.branchId)
        if (!product) throw new Error('Cannot create cart items without products')

        return prisma.order_items.create({
            data: {
                id: faker.string.uuid(),
                orderId: order.id,
                productId: product.id,
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
