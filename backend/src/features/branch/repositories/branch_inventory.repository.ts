import { prisma } from "../../../config/prisma";

export class BranchInventoryRepository {
    async findRandomBranchInventory(branchId: string) {
        const where = { 
            branchId: branchId,
            currentStock: { gt: 1 } 
        }

        const count = await prisma.branch_inventories.count({ where })
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return await prisma.branch_inventories.findFirst({
            where,
            skip,
            select: { 
                id: true, currentStock: true,
                product: {
                    select: { basePrice: true }
                } 
            }
        })
    }

    findManyItemsByBranch = async (branchId: string) => {
        return prisma.branch_inventories.findMany({
            where: { branchId },
            select: {
                id: true, currentStock: true, product: {
                    select: { basePrice: true },
                },
            },
        })
    }
}
