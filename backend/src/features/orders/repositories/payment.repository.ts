import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class PaymentRepository {
    async createPayment(orderId: string, gatewayRef: string | null) {
        return await prisma.payments.create({
            data: { orderId, method: gatewayRef ? 'GATEWAY' : 'MANUAL', status: 'PENDING', gatewayRef },
            select: { id: true }
        })
    }

    async updatePaymentStatusByGatewayRef(gatewayRef: string, status: PaymentStatus) {
        return await prisma.payments.updateMany({
            where: { gatewayRef },
            data: { status }
        })
    }
}