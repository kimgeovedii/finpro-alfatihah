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

    async updatePaymentStatusById(id: string, adminId: string, isConfirm: boolean) {
        return await prisma.payments.update({
            where: { id },
            data: { 
                status: isConfirm ? "SUCCESS" : "REJECTED",
                approvedAt: new Date,
                approvedBy: adminId 
            },
            select: {
                orderId: true, order: {
                    select: {
                        orderNumber: true, user: {
                            select: {
                                email: true, username: true
                            }
                        }
                    }
                }
            }
        })
    }

    findByOrderId = async (orderId: string) => prisma.payments.findFirst({ where: { orderId } })
}
