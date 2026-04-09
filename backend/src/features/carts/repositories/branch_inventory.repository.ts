import { prisma } from "../../../config/prisma"

export class BranchInventoryRepository {
    async findByProductAndBranch(productId: string, branchId: string) {
        return prisma.branch_inventories.findFirst({
            where: { productId, branchId }
        })
    }
}