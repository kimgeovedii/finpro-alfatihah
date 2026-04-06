import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { randomEnumValue } from "../../src/utils/generator"
import { UserRepository } from "../../src/features/user/repositories/user.repository"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { AddressRepository } from "../../src/features/user/repositories/address.repository"
import { OrderStatus, UserRole } from "@prisma/client"

class OrderFactory {
    private userRepository: UserRepository
    private branchRepository: BranchRepository
    private addressRepository: AddressRepository

    constructor(){
        this.userRepository = new UserRepository()
        this.branchRepository = new BranchRepository()
        this.addressRepository = new AddressRepository()
    }

    private randomOrderStatus = (): OrderStatus => randomEnumValue(Object.values(OrderStatus))

    public create = async () => {
        // Get random customer from repo
        const user = await this.userRepository.findRandomUser(UserRole.CUSTOMER)
        if (!user) throw new Error('Cannot create order without user')

        // Get random branch from repo
        const branch = await this.branchRepository.findRandomBranch()
        if (!branch) throw new Error('Cannot create order without branch')

        // Get random address from repo
        const address = await this.addressRepository.findRandomByUserId(user.id)
        if (!address) throw new Error('Cannot create order without address')

        // Generate pricing
        const totalPrice = faker.number.int({ min: 50000, max: 500000 })
        const shippingCost = faker.number.int({ min: 10000, max: 30000 })
        const finalPrice = totalPrice + shippingCost

        // Random status
        const status = this.randomOrderStatus()

        // Time logic
        let shippedAt: Date | null = null
        let confirmedAt: Date | null = null
        let rejectedAt: Date | null = null

        if (status === OrderStatus.SHIPPED || status === OrderStatus.CONFIRMED) shippedAt = faker.date.recent()
        if (status === OrderStatus.CONFIRMED) confirmedAt = faker.date.recent()
        if (status === OrderStatus.CANCELLED) rejectedAt = faker.date.recent()

        return prisma.orders.create({
            data: {
                id: faker.string.uuid(),
                orderNumber: `ORD-${Date.now()}-${faker.number.int({ min: 100, max: 999 })}`,
                userId: user.id,
                branchId: branch.id,
                addressId: address.id,
                status,
                totalPrice,
                finalPrice,
                shippingCost,
                paymentDeadline: faker.date.soon({ days: 1 }),
                shippedAt,
                confirmedAt,
                rejectedAt,
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

export default OrderFactory