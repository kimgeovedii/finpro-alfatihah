

import { prisma } from "../../../config/prisma"

export class BranchInventoryRepository {
    findById = async (id: string) => prisma.branch_inventories.findFirst({ where: { id } })

    async incrementStock(branchInventoryId: string, quantity: number) {
        return await prisma.branch_inventories.update({
            where: { id: branchInventoryId },
            data: {
                currentStock: { increment: quantity }
            }
        })
    }
    
    async decrementStock(branchInventoryId: string, quantity: number) {
        return await prisma.branch_inventories.update({
            where: { id: branchInventoryId },
            data: {
                currentStock: { decrement: quantity }
            }
        })
    }
}