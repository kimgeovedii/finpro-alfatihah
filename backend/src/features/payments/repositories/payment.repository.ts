import { prisma } from "../../../config/prisma";

export class PaymentRepository {
    async updatePaymentEvidenceByOrderId(orderId: string, evidence: string) {
        return await prisma.payments.updateMany({
            where: { orderId },
            data: {
                evidence, method: 'MANUAL', status: 'PENDING',
            }
        })
    }

    findByOrderId = async (orderId: string) => prisma.payments.findFirst({ where: { orderId } })
}
