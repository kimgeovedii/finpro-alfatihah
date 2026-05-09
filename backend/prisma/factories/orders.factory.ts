import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { randomEnumValue } from "../../src/utils/generator"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client"
import { orderCode, paymentDeadline } from "../../src/constants/business.const"
import { BranchInventoryRepository } from "../../src/features/branch/repositories/branch_inventory.repository"
import { maxDiscountFactorSeed, maxQuantityItemSelectedSeed, maxShippingCostSeed, minDiscountFactorSeed, minQuantityItemSelectedSeed, minShippingCostSeed, oldestPeriodYears } from "../../src/constants/seed.const"

class OrderFactory {
    private branchRepository: BranchRepository
    private branchInventoryRepository: BranchInventoryRepository

    constructor(){
        this.branchRepository = new BranchRepository()
        this.branchInventoryRepository = new BranchInventoryRepository()
    }

    private randomOrderStatus = (): OrderStatus => randomEnumValue(Object.values(OrderStatus))

    private randomPaymentMethod = (): PaymentMethod => randomEnumValue(Object.values(PaymentMethod))

    private resolvePaymentStatus = (orderStatus: OrderStatus): PaymentStatus => {
        if (orderStatus === OrderStatus.WAITING_PAYMENT || orderStatus === OrderStatus.WAITING_PAYMENT_CONFIRMATION) return PaymentStatus.PENDING
        if (orderStatus === OrderStatus.PROCESSING || orderStatus === OrderStatus.SHIPPED || orderStatus === OrderStatus.CONFIRMED) return PaymentStatus.SUCCESS
        
        return PaymentStatus.REJECTED
    }

    private findRandomEmployee = async (): Promise<string | null> => {
        const count = await prisma.employee.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)
        const employee = await prisma.employee.findFirst({ skip, select: { id: true } })

        return employee?.id ?? null
    }

    public create = async () => {
        // Get random address
        const addresses = await prisma.address.findMany({ select: { id: true, userId: true } })
        if (addresses.length === 0) throw new Error('Cannot create order without address')
        const randomAddress = faker.helpers.arrayElement(addresses)

        // Get random branch from repo
        const branch = await this.branchRepository.findRandomBranch()
        if (!branch) throw new Error('Cannot create order without branch')

        // Get random inventories from this branch
        const inventories = await this.branchInventoryRepository.findManyItemsByBranch(branch.id)
        if (inventories.length === 0) throw new Error('Cannot create order without branch inventory')
        const selectedInventories = faker.helpers.arrayElements(inventories, faker.number.int({ min: 1, max: Math.min(15, inventories.length) }))

        // Build order items and sum totalPrice
        let totalPrice = 0
        const orderItemsData = selectedInventories.map((dt: any) => {
            const quantity = faker.number.int({ min: minQuantityItemSelectedSeed, max: maxQuantityItemSelectedSeed })
            const price = quantity * dt.product.basePrice
            totalPrice += price
            return { id: faker.string.uuid(), productId: dt.id, price, quantity }
        })

        // Generate pricing — finalPrice <= totalPrice + shippingCost
        const shippingCost = faker.number.int({ min: minShippingCostSeed, max: maxShippingCostSeed })
        const discountFactor = faker.number.float({ min: minDiscountFactorSeed, max: maxDiscountFactorSeed })
        const finalPrice = Math.round(totalPrice * discountFactor) + shippingCost

        // Random status
        const status = this.randomOrderStatus()
        const createdAt = faker.date.past({ years: oldestPeriodYears })

        // Time logic
        let shippedAt: Date | null = null
        let confirmedAt: Date | null = null
        let rejectedAt: Date | null = null
        if (status === OrderStatus.SHIPPED || status === OrderStatus.CONFIRMED) shippedAt = faker.date.soon({ days: 3, refDate: createdAt })
        if (status === OrderStatus.CONFIRMED) confirmedAt = faker.date.soon({ days: 5, refDate: shippedAt ?? createdAt })
        if (status === OrderStatus.CANCELLED) rejectedAt = faker.date.soon({ days: 1, refDate: createdAt })

        // Determine payment status based on order status
        const method = this.randomPaymentMethod()
        const paymentStatus = this.resolvePaymentStatus(status)
        const orderNumber = `${orderCode}-${createdAt.getTime()}-${faker.number.int({ min: 100, max: 999 })}`

        // Time logic
        let approvedAt: Date | null = null
        let paymentRejectedAt: Date | null = null
        let approvedBy: string | null = null
        if (paymentStatus === PaymentStatus.SUCCESS) {
            approvedAt = faker.date.soon({ days: 1, refDate: createdAt })
            approvedBy = await this.findRandomEmployee()
        }
        if (paymentStatus === PaymentStatus.REJECTED) paymentRejectedAt = faker.date.soon({ days: 1, refDate: createdAt })

        return prisma.$transaction(async (tx) => {
            const order = await tx.orders.create({
                data: {
                    id: faker.string.uuid(),
                    orderNumber,
                    userId: randomAddress.userId,
                    branchId: branch.id,
                    addressId: randomAddress.id,
                    status,
                    totalPrice,
                    finalPrice,
                    shippingCost,
                    paymentDeadline: new Date(createdAt.getTime() + paymentDeadline),
                    shippedAt,
                    confirmedAt,
                    rejectedAt,
                    createdAt,
                    items: {
                        createMany: { data: orderItemsData },
                    },
                },
            })

            await tx.payments.create({
                data: {
                    id: faker.string.uuid(),
                    orderId: order.id,
                    method,
                    status: paymentStatus,
                    evidence: method === PaymentMethod.MANUAL ? faker.image.url() : null,
                    approvedBy,
                    approvedAt,
                    rejectedAt: paymentRejectedAt,
                    gatewayRef: method === PaymentMethod.GATEWAY ? orderNumber : null,
                    createdAt,
                },
            })

            return order
        })
    }

    public createMany = async (count: number) => {
        for (let i = 0; i < count; i++) {
            await this.create()
        }
    }
}

export default OrderFactory