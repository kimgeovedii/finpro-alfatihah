import { prisma } from "../../../config/prisma";

export class PaymentRepository {
    async createPayment(orderId: string) {
        return await prisma.payments.create({
            data: {
                orderId, method: 'MANUAL', status: 'PENDING',
            },
            select: { id: true }
        })
    }
}