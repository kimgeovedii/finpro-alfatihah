import { prisma } from "../../../config/prisma";

export class BranchRepository {
    async findById(branchId: string) {
        return await prisma.branch.findFirst({
            where: { id: branchId },
            select: {
                address: true, latitude: true, longitude: true, maxDeliveryDistance: true,
            }
        })
    }
}