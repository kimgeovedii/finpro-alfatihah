import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { randomEnumValue } from "../../src/utils/generator"
import { OrderRepository } from "../../src/features/orders/repositories/order.repository"
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client"

class PaymentFactory {
    private orderRepository: OrderRepository

    constructor(){
        this.orderRepository = new OrderRepository()
    }

    private randomPaymentMethod = (): PaymentMethod => randomEnumValue(Object.values(PaymentMethod))

    public create = async () => {
        // Get random order from repo
        const order = await this.orderRepository.findRandomOrder()
        if (!order) throw new Error('Cannot create payment without order')

        // Generate method
        const method = this.randomPaymentMethod()

        // Determine status based on order status
        let status: PaymentStatus
        if (order.status === OrderStatus.WAITING_PAYMENT) {
            status = PaymentStatus.PENDING
        } else if (order.status === OrderStatus.WAITING_PAYMENT_CONFIRMATION) {
            status = PaymentStatus.PENDING
        } else if (order.status === OrderStatus.PROCESSING || order.status === OrderStatus.SHIPPED || order.status === OrderStatus.CONFIRMED) {
            status = PaymentStatus.SUCCESS
        } else {
            status = PaymentStatus.REJECTED
        }

        // Time logic
        let approvedAt: Date | null = null
        let rejectedAt: Date | null = null
        if (status === PaymentStatus.SUCCESS) approvedAt = faker.date.recent()
        if (status === PaymentStatus.REJECTED) rejectedAt = faker.date.recent()

        // Get a real employee ID for approvedBy (it's a FK to Employee table)
        let approvedById: string | null = null
        if (status === PaymentStatus.SUCCESS) {
            const employee = await prisma.employee.findFirst({
                select: { id: true },
                orderBy: { id: 'asc' },
            })
            approvedById = employee?.id ?? null
        }

        return prisma.payments.create({
            data: {
                id: faker.string.uuid(),
                orderId: order.id,
                method,
                status,
                evidence: method === PaymentMethod.MANUAL ? faker.image.url() : null,
                approvedBy: approvedById,
                approvedAt,
                rejectedAt,
                gatewayRef: method === PaymentMethod.GATEWAY ? `PAY-${faker.string.alphanumeric(10)}` : null,
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

export default PaymentFactory