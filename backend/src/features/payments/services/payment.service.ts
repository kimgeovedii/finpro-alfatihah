import { OrderStatus } from "@prisma/client"
import { OrderRepository } from "../repositories/order.repository"
import { EmployeeRepository } from "../repositories/employee.repository"
import { PaymentRepository } from "../repositories/payment.repository"

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

        // Repo : get employee by branch id 
        const employee = await this.employeeRepo.findEmployeeByBranchId(order.branchId)

        return payment
    }
}