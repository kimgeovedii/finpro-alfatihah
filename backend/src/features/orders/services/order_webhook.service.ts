import { OrderRepository } from "../repositories/order.repository"
import { PaymentRepository } from "../repositories/payment.repository"
import { PaymentStatus } from "@prisma/client"

export class OrderWebhookService {
    private orderRepo = new OrderRepository()
    private paymentRepo = new PaymentRepository()

    // Webhook
    async handleMidtransWebhook(notification: any) {
        const { orderNumber, transaction_status, fraud_status } = notification
    
        let paymentStatus: PaymentStatus
    
        if (transaction_status === 'capture' && fraud_status === 'accept') {
            paymentStatus = 'SUCCESS'
        } else if (transaction_status === 'settlement') {
            paymentStatus = 'SUCCESS'
        } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
            paymentStatus = 'REJECTED'
        } else {
            paymentStatus = 'PENDING'
        }
    
        await this.paymentRepo.updatePaymentStatusByGatewayRef(orderNumber, paymentStatus)
    
        if (paymentStatus === 'SUCCESS') {
            const order = await this.orderRepo.findOrderById(orderNumber, "orderNumber")
            if (order) await this.orderRepo.updateOrderStatusById(order.id, 'PROCESSING')
        }
    }
}