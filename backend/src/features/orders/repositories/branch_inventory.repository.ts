

import { prisma } from "../../../config/prisma"

export class BranchInventoryRepository {
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