import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { UserRole } from "@prisma/client"
import { UserRepository } from "../../src/features/user/repositories/user.repository"

class VoucherReferralFactory {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    private async findRandomCustomer() {
        return this.userRepository.findRandomUser(UserRole.CUSTOMER);
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
        const users = await this.userRepository.findAll();
        const customers = users.filter((u: any) => u.role === UserRole.CUSTOMER);

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
