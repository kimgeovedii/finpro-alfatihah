import { OrderStatus } from "@prisma/client"
import { OrderRepository } from "../repositories/order.repository"
import { EmployeeRepository } from "../repositories/employee.repository"
import { PaymentRepository } from "../repositories/payment.repository"
import { Mailer } from "../../../config/mailer"
import { getPaymentConfirmationTemplate } from "../views/payment.view"

export class PaymentService {
    private orderRepo = new OrderRepository()
    private paymentRepo = new PaymentRepository()
    private employeeRepo = new EmployeeRepository()

    async addEvidenceManualPayment(userId: string, orderId: string, filePath: string) {
        // Repo : get order by id
        const order = await this.orderRepo.findById(orderId, OrderStatus.WAITING_PAYMENT)
        if (!order) throw { code: 404, message: 'Order not found' }
        
        // Add logic to check expired payment time
        if (new Date() > new Date(order.paymentDeadline)) throw { code: 422, message: 'Payment deadline has passed' }

        // Repo : update payment by order id
        const paymentUpdated = await this.paymentRepo.updatePaymentEvidenceByOrderId(orderId, filePath)
        if (paymentUpdated.count !== 1) throw { code: 404, message: 'Payment not found' }

        // Repo : update order by order id
        await this.orderRepo.updateOrderStatusById(orderId, 'WAITING_PAYMENT_CONFIRMATION')

        // Repo : get payment detail
        const payment = await this.paymentRepo.findByOrderId(orderId)
        if (!payment) throw { code: 404, message: 'Payment not found' }

        // Repo : get employee by branch id 
        const employees = await this.employeeRepo.findEmployeeByBranchId(order.branchId)

        if (employees !== null) {
            // Mailer : broadcast email to all admin store if a payment's evidence has been uploaded
            for (const dt of employees) {
                const emailHtml = getPaymentConfirmationTemplate({
                    username: dt.user?.username ?? "",
                    payment: {
                        orderNumber: payment?.orderId,
                        amount: order.finalPrice,
                        evidence: filePath
                    }
                })

                await Mailer.client.sendMail({
                    from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                    to: dt.user?.email,
                    subject: "Payment Confirmation",
                    html: emailHtml,
                })
            }
        }

        return payment
    }
}