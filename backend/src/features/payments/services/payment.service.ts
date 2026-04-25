import { OrderStatus } from "@prisma/client"
import { OrderRepository } from "../repositories/order.repository"
import { EmployeeRepository } from "../repositories/employee.repository"
import { PaymentRepository } from "../repositories/payment.repository"
import { Mailer } from "../../../config/mailer"
import { getPaymentConfirmationTemplate, getPaymentConfirmedTemplate } from "../views/payment.view"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"
import { StockJournalRepository } from "../repositories/stok_journal.repository"

export class PaymentService {
    private orderRepo = new OrderRepository()
    private branchInventoryRepo = new BranchInventoryRepository()
    private paymentRepo = new PaymentRepository()
    private employeeRepo = new EmployeeRepository()
    private stockJournalRepo = new StockJournalRepository()

    async addEvidenceManualPayment(userId: string, orderId: string, filePath: string) {
        // Repo : get order by id
        const order = await this.orderRepo.findById(orderId, OrderStatus.WAITING_PAYMENT)
        if (!order) throw { code: 404, message: 'Order not found' }
        
        // Check expired payment time
        if (new Date() > new Date(order.paymentDeadline)) {
            // Repo : update order by order id
            await this.orderRepo.updateOrderStatusById(orderId, 'CANCELLED')

            // Repo : update payment by order id
            await this.paymentRepo.updatePaymentStatusById(order.payments[0].id, null, false)

            const orderMessageToBranch = `An order ${order.orderNumber} has been cancelled`
            await Promise.all(
                order.items.map(async (dt) => {
                    // Repo : get branch inventory by id
                    const branchInventory = await this.branchInventoryRepo.findById(dt.product.id)
                    if (!branchInventory) throw { code: 404, message: `Inventory not found` }
            
                    const stockBefore: number = branchInventory.currentStock
                    const stockAfter: number = stockBefore + dt.quantity
                    const quantityChange: number = dt.quantity
            
                    // Repo : update product qty
                    await this.branchInventoryRepo.incrementStock(dt.product.id, dt.quantity)
            
                    // Repo : create stock journal 
                    await this.stockJournalRepo.createStockJournal(
                        branchInventory.productId, dt.product.id, 'IN', quantityChange, stockBefore, stockAfter, 'ORDER', orderId, orderMessageToBranch
                    )
                })
            )

            throw { code: 422, message: 'Payment deadline has passed' }
        }

        // Repo : update payment by order id
        const paymentUpdated = await this.paymentRepo.updatePaymentEvidenceByOrderId(orderId, filePath, 'PENDING')
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

    async putUpdatePaymentStatusById(userId: string, paymentId: string, payload: { isConfirm: boolean }) {
        // Repo : get current payment to make sure evidence exist
        const checkPayment = await this.paymentRepo.findById(paymentId)
        if (checkPayment?.method === "GATEWAY") throw { code: 422, message: 'Only manual payment can be validated' }
        if (checkPayment?.evidence === null) throw { code: 422, message: 'Evidence not uploaded yet' }

        // Repo : get employee id by user id
        const employee = await this.employeeRepo.findEmployeeByUserId(userId)
        if (!employee) throw { code: 404, message: 'Employee not found' }
        
        // Repo : update payment status
        const payment = await this.paymentRepo.updatePaymentStatusById(paymentId, employee?.id, payload.isConfirm)
        if (!payment) throw { code: 404, message: 'Payment not found' }

        // Repo : update payment by order id
        const paymentUpdated = await this.paymentRepo.updatePaymentEvidenceByOrderId(payment.orderId, null, 'REJECTED')
        if (paymentUpdated.count !== 1) throw { code: 404, message: 'Payment not found' }
        
        // Repo : update order by order id
        const order = await this.orderRepo.updateOrderStatusById(payment.orderId, payload.isConfirm ? 'PROCESSING' : 'WAITING_PAYMENT')
        if (!order) throw { code: 404, message: 'Order not found' }

        // Mailer : broadcast email to user if payment has been confirmed
        const emailHtml = getPaymentConfirmedTemplate({
            username: payment.order.user.username,
            orderNumber: payment.order.orderNumber
        })

        await Mailer.client.sendMail({
            from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
            to: payment.order.user.email,
            subject: payload.isConfirm ? "Payment Confirmed!" : "Payment Rejected!",
            html: emailHtml,
        })
    }
}