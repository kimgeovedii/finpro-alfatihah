import { prisma } from "../../../config/prisma";

export class VoucherUsedRepository {
    async create(voucherId: string, orderId: string ) {
        return await prisma.voucher_useds.create({
            data: { voucherId, orderId }
        })
    }
}