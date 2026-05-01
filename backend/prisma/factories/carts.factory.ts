import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { UserRepository } from "../../src/features/user/repositories/user.repository"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { UserRole } from "@prisma/client"
import { BranchInventoryRepository } from "../../src/features/branch/repositories/branch_inventory.repository"
import { maxQuantityItemSelectedSeed, minQuantityItemSelectedSeed, oldestPeriodYears } from "../../src/constants/seed.const"

class CartFactory {
    private userRepository: UserRepository
    private branchRepository: BranchRepository
    private branchInventoryRepository: BranchInventoryRepository

    constructor(){
        this.userRepository = new UserRepository()
        this.branchRepository = new BranchRepository()
        this.branchInventoryRepository = new BranchInventoryRepository()
    }

    public create = async (role: UserRole) => {
        // Get random user from repo
        const user = await this.userRepository.findRandomUser(role)
        if (!user) throw new Error('Cannot create cart without user')

        // Get random branch from repo
        const branch = await this.branchRepository.findRandomBranch()
        if (!branch) throw new Error('Cannot create cart without branch')

        // Get inventories from this branch
        const inventories = await this.branchInventoryRepository.findManyItemsByBranch(branch.id)
        if (inventories.length === 0) throw new Error('Cannot create cart without branch inventory')
        const selectedInventories = faker.helpers.arrayElements(inventories, faker.number.int({ min: minQuantityItemSelectedSeed, max: Math.min(maxQuantityItemSelectedSeed, inventories.length) }))

        const cartItemsData = selectedInventories.map((dt: any) => ({
            id: faker.string.uuid(),
            productId: dt.id,
            quantity: faker.number.int({ min: minQuantityItemSelectedSeed, max: maxQuantityItemSelectedSeed }),
            createdAt: faker.date.past({ years: oldestPeriodYears }),
        }))

        return prisma.carts.create({
            data: {
                id: faker.string.uuid(),
                userId: user.id,
                branchId: branch.id,
                createdAt: faker.date.past({ years: oldestPeriodYears }),
                items: {
                    createMany: { data: cartItemsData },
                },
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
