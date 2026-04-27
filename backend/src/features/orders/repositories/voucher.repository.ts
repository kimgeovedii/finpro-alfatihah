import { prisma } from "../../../config/prisma"

export class VoucherRepository {
    async findById(id: string) {
        return await prisma.vouchers.findUnique({ where: { id } })
    }

    async decrementQuota(id: string) {
        return await prisma.vouchers.update({
            where: { id },
            data: {
                quota: { decrement: 1 }
            }
        })
    }
}