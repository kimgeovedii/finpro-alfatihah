import { prisma } from "../../config/prisma";

export class GlobalAddressRepository {
    async findManyByUserId(userId: string) {
        return prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
}
