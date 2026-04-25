import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class PaymentRepository {
    async updatePaymentEvidenceByOrderId(orderId: string, evidence: string | null, status: PaymentStatus) {
        return await prisma.payments.updateMany({
            where: { orderId },
            data: {
                evidence, method: 'MANUAL', status,
            }
        })
    }

    async updatePaymentStatusById(id: string, adminId: string | null, isConfirm: boolean) {
        return await prisma.payments.update({
            where: { id },
            data: { 
                status: isConfirm ? "SUCCESS" : "REJECTED",
                ...(adminId && {
                    approvedAt: new Date(),
                    approvedBy: adminId,
                }),
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

    findById = async (id: string) => prisma.payments.findFirst({ where: { id } })

    findByOrderId = async (orderId: string) => prisma.payments.findFirst({ where: { orderId } })
}
