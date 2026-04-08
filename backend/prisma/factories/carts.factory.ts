import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

import { UserRepository } from "../../src/features/user/repositories/user.repository"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { UserRole } from "@prisma/client"

class CartFactory {
    private userRepository: UserRepository
    private branchRepository: BranchRepository

    constructor(){
        this.userRepository = new UserRepository()
        this.branchRepository = new BranchRepository()
    }

    public create = async (role: UserRole) => {
        // Get random user from repo
        const user = await this.userRepository.findRandomUser(role)
        if (!user) throw new Error('Cannot create cart without user')

        // Get random branch from repo
        const branch = await this.branchRepository.findRandomBranch()
        if (!branch) throw new Error('Cannot create cart without branch')

        return prisma.carts.create({
            data: {
                id: faker.string.uuid(),
                userId: user.id,
                branchId: branch.id,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number, role: UserRole) => {
        for (let i = 0; i < count; i++) {
            await this.create(role)
        }
    }
}

export default CartFactory
