import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { UserRole } from "@prisma/client"

class VoucherReferralFactory {
    private async findRandomCustomer() {
        const count = await prisma.user.count({
            where: { role: UserRole.CUSTOMER }
        })
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.user.findFirst({
            where: { role: UserRole.CUSTOMER },
            skip,
            select: { id: true }
        })
    }

    public create = async (userId?: string) => {
        // Use provided userId or get random customer
        let targetUserId = userId

        if (!targetUserId) {
            const user = await this.findRandomCustomer()
            if (!user) throw new Error('Cannot create voucher referral without customer')
            targetUserId = user.id
        }

        // Check if this user already has a referral record
        const existing = await prisma.voucher_referral.findFirst({
            where: { userId: targetUserId }
        })

        if (existing) {
            return existing
        }

        return prisma.voucher_referral.create({
            data: {
                id: faker.string.uuid(),
                userId: targetUserId,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdReferrals = []
        for (let i = 0; i < count; i++) {
            const referral = await this.create()
            createdReferrals.push(referral)
        }
        return createdReferrals
    }

    // Create referral records for all customers
    public createForAllCustomers = async () => {
        const customers = await prisma.user.findMany({
            where: { role: UserRole.CUSTOMER },
            select: { id: true }
        })

        if (customers.length === 0) {
            return []
        }

        const allReferrals = []

        // Create referral for each customer (one per customer)
        for (const customer of customers) {
            const referral = await this.create(customer.id)
            allReferrals.push(referral)
        }

        return allReferrals
    }
}

export default VoucherReferralFactory
