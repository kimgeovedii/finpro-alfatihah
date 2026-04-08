import { prisma } from "../../../config/prisma";

export class AddressRepository {
    async findRandomByUserId(userId: string) {   
        const where = { userId } 

        const count = await prisma.address.count({ where })
        if (count === 0) return null
    
        const skip = Math.floor(Math.random() * count)
    
        return prisma.address.findFirst({
            where,
            skip,
            select: { id: true },
        })
    }
}
