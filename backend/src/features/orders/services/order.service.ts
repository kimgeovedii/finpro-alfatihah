import { isWithinDeliveryRange } from "../../../utils/location"
import { getCityIdFromCoords, getShippingCost } from "../../../utils/shipping"
import { AddressRepository } from "../repositories/address.repository"
import { BranchRepository } from "../repositories/branch.repository"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"
import { CartRepository } from "../repositories/cart.repository"
import { OrderRepository } from "../repositories/order.repository"
import { PaymentRepository } from "../repositories/payment.repository"
import { StockJournalRepository } from "../repositories/stok_journal.repository"
import { UserRepository } from "../repositories/user.repository"
import { Mailer } from "../../../config/mailer";
import { getBranchOrderBroadcastTemplate, getOrderCreatedPaymentTemplate } from "../views/order.view"
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client"
import { getOrderMailTemplate } from "../../../utils/template"
import { EmployeeRepository } from "../repositories/employee.repository"
import { snap } from "../../../config/midtrans"

export class OrderService {
    private orderRepo = new OrderRepository()
    private cartRepo = new CartRepository()
    private stockJournalRepo = new StockJournalRepository()
    private addressRepo = new AddressRepository()
    private branchRepo = new BranchRepository()
    private branchInventoryRepo = new BranchInventoryRepository()
    private paymentRepo = new PaymentRepository()
    private userRepo = new UserRepository()
    private employeeRepo = new EmployeeRepository()

    async getAllOrders(page: number, limit: number, userId: string, branchId: string | null, orderNumber: string | null, dateStart: string | null, dateEnd: string | null) {
        return await this.orderRepo.findAllOrders(page, limit, userId, branchId, orderNumber, dateStart, dateEnd)
    }

    async getAllOrderByBranchId(page: number, limit: number, branchId: string, status: OrderStatus | null) {
        return await this.orderRepo.findAllOrdersByBranchId(page, limit, branchId, status)
    }

    async getOrderDetailByOrderNumber(role: UserRole, userId: string, orderNumber: string) {
        return await this.orderRepo.findOrderDetailByOrderNumber(role, userId, orderNumber)
    }

    async getOrderSummary(userId: string) {
        return await this.orderRepo.getOrderSummary(userId)
    }

    async getOrderSummaryByBranchId(userId: string, branchId: string) {
        return await this.orderRepo.getOrderSummarByBranchId(userId, branchId)
    }

    async addCartToOrder(userId: string, payload: { cartId: string, voucherId?: string, addressId: string, paymentMethod: 'MANUAL' | 'GATEWAY' }) {
        const { cartId, addressId, paymentMethod } = payload

        // Repo : get cart with its items based on cartId
        const cart = await this.cartRepo.findCartWithItemsById(cartId)
        if (!cart) throw { code: 404, message: 'Cart not found' }

        // Check if this cart belongs to user
        if (cart.userId !== userId) throw { code: 403, message: 'Forbidden access to this cart' }

        // Check if cart has items
        if (!cart.items || cart.items.length === 0) throw { code: 422, message: 'Cart is empty' }

        // Repo : get user address 
        const address = await this.addressRepo.findById(addressId)
        if (!address) throw { code: 404, message: 'Address not found' }

        // Check if address belongs to user
        if (address.userId !== userId) throw { code: 403, message: 'Forbidden access to this address' }

        // Repo : get branch data from cart branchId
        const branch = await this.branchRepo.findById(cart.branchId)
        if (!branch) throw { code: 404, message: 'Branch not found' }

        // Helper : validate if user address is within branch max delivery distance
        const rangeValidate = isWithinDeliveryRange(address.lat, address.long, branch.latitude, branch.longitude, branch.maxDeliveryDistance)
        const range = rangeValidate.distance.toFixed()
        if (!rangeValidate.isInsideRange) throw { code: 422, message: `Delivery address is outside the branch delivery range. Your distance to our branch is ${range} Km` }

        // Helper : calculate shipping cost based on distance
        const [originId, destinationId] = await Promise.all([
            getCityIdFromCoords(branch.latitude, branch.longitude),
            getCityIdFromCoords(address.lat, address.long)
        ])
    
        // Helper : get shipping cost from Raja Ongkir + Opencage
        const shippingCost = await getShippingCost(originId, destinationId)

        // Calculate total price from cart items
        const totalPrice = cart.items.reduce((sum, item) => {
            const basePrice = item.product.product.basePrice
            return sum + (basePrice * item.quantity)
        }, 0)

        // Soon LOL..
        const finalPrice = totalPrice

        // Repo : create order
        const order = await this.orderRepo.createOrder(userId, cart.branchId, addressId, totalPrice, finalPrice, shippingCost, cart.items)

        // Repo : create payment based on order id
        let payment
        let snapToken: string | undefined
        let redirectUrl: string | undefined

        // Repo : create payment based on order id
        if (paymentMethod === 'MANUAL') payment = await this.paymentRepo.createPayment(order.id, null)
        if (paymentMethod === 'GATEWAY') {
            // Repo : get user profile
            const user = await this.userRepo.findById(userId)
    
            const midtransPayload = {
                transaction_details: {
                    order_id: order.orderNumber,
                    gross_amount: Math.round(finalPrice + shippingCost),
                },
                customer_details: {
                    first_name: user?.username ?? "",
                    email: user?.email ?? "",
                },
            }
    
            const midtransResponse = await snap.createTransaction(midtransPayload)
            snapToken = midtransResponse.token
            redirectUrl = midtransResponse.redirect_url
    
            // Repo : create payment for gateway
            // order number is set to be as payment's gateway ref as well
            payment = await this.paymentRepo.createPayment(order.id, order.orderNumber)
        }

        // Repo : get user profile
        const user = await this.userRepo.findById(cart.userId)
        const orderMessageToBranch = `You got an order ${order.orderNumber} from ${user?.username}`

        await Promise.all(
            cart.items.map(async (dt) => {
                // Repo : get branch inventory by id
                const branchInventory = await this.branchInventoryRepo.findById(dt.product.id)
                if (!branchInventory) throw { code: 404, message: `Inventory not found` }
        
                const stockBefore: number = branchInventory.currentStock
                const stockAfter: number = stockBefore - dt.quantity
                const quantityChange: number = dt.quantity
        
                // Repo : update product qty
                await this.branchInventoryRepo.decrementStock(dt.product.id, dt.quantity)
        
                // Repo : create stock journal 
                await this.stockJournalRepo.createStockJournal(
                    branchInventory.productId, dt.product.id, 'OUT', quantityChange, stockBefore, stockAfter, 'ORDER', order.id, orderMessageToBranch
                )
            })
        )

        // Repo : delete cart and its items
        await this.cartRepo.deleteCart(cartId)

        // Mailer : inform user that an order has been made
        const emailHtml = getOrderCreatedPaymentTemplate({
            username: user?.username ?? "",
            orderNumber: order.orderNumber,
            amount: finalPrice,
            paymentDeadline: order.paymentDeadline
        }, true) // for now

        await Mailer.client.sendMail({
            from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
            to: user?.email,
            subject: "Order Checkout",
            html: emailHtml,
        })

        return { orderId: order.id, paymentId: payment!.id, ...(paymentMethod === 'GATEWAY' && { snapToken, redirectUrl }) }
    }

    async addShipping(orderNumber: string) {
        // Repo : check if all stock product is enough to be shipped
        const isReady = await this.orderRepo.isMatchingQuantityStock(orderNumber)
        if (!isReady) throw { code: 422, message: 'Your stock is not ready yet to be shipped' }

        // Repo : update order status
        const order = await this.orderRepo.updateOrderStatusById(orderNumber, 'SHIPPED')
        if (!order) throw { code: 404, message: 'Order not found' }
        
        // Mailer : inform user that an order has been shipped
        const emailHtml = getOrderMailTemplate({
            username: order.user?.username ?? "",
            orderNumber: orderNumber,
            title: 'Order shipped! 🎉🎉🎉',
            content: 'your order has been shipped. Please wait while our courier sending your order. Thanks for your trust with Alfatihah'
        })

        await Mailer.client.sendMail({
            from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
            to: order.user?.email,
            subject: "Order is on the way",
            html: emailHtml,
        })
    }

    async addCancelOrder(userId: string, role: UserRole, orderNumber: string) {
        // Repo : get order item
        const order = await this.orderRepo.findOrderById(orderNumber, "orderNumber")
        if (!order) throw { code: 404, message: 'Order not found' }

        if (role === "EMPLOYEE") { 
            // Make sure only order who still in store (not shipped or confirmed yet)
            if (order.status === "SHIPPED" || order.status === "CONFIRMED") throw { code: 422, message: 'Only order who still in store can be cancelled' }
        } else {
            // Check if this order belongs to user
            if (order.userId !== userId) throw { code: 403, message: 'Forbidden access to this order' }

            // Prevent double cancelled order
            if (order.status === "CANCELLED") throw { code: 422, message: 'Order already cancelled' }

            // Check if this order still cancelable (status = waiting payment)
            if (order.status !== "WAITING_PAYMENT") throw { code: 422, message: 'You can only cancel orders that have not been paid' }
        }

        // Prevent double cancelled order
        if (order.status === "CANCELLED") throw { code: 422, message: 'Order already cancelled' }
        const orderMessageToBranch = `An order ${orderNumber} has been cancelled`

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
                    branchInventory.productId, dt.product.id, 'IN', quantityChange, stockBefore, stockAfter, 'ORDER', order.id, orderMessageToBranch
                )
            })
        )

        // Repo : update order status
        const orderNew = await this.orderRepo.updateOrderStatusById(orderNumber, 'CANCELLED')
        if (!orderNew) throw { code: 404, message: 'Order not found' }
        
        if (role === "EMPLOYEE") {
            // Mailer : inform user that an order has been shipped
            const emailHtml = getOrderMailTemplate({
                username: orderNew.user?.username ?? "",
                orderNumber: orderNumber,
                title: 'Order cancelled! 🙏',
                content: "your order has been cancel. We're very sorry about this, your payment will be refunded as soon as possible. Thanks for your trust with Alfatihah"
            })

            await Mailer.client.sendMail({
                from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                to: orderNew.user?.email,
                subject: "Order is cancelled",
                html: emailHtml,
            })
        }
    }

    async addConfirmOrder(userId: string, orderNumber: string) {
        // Repo : get order item
        const order = await this.orderRepo.findOrderById(orderNumber, "orderNumber")
        if (!order) throw { code: 404, message: 'Order not found' }

        // Check if this order belongs to user
        if (order.userId !== userId) throw { code: 403, message: 'Forbidden access to this order' }

        // Prevent double confirmed order
        if (order.status === "CONFIRMED") throw { code: 422, message: 'Order already confirmed' }

        // Make sure only order who still shipped can be confirmed
        if (order.status !== "SHIPPED") throw { code: 422, message: 'Only order who still in shipped can be confirmed' }

        // Repo : update order status
        const orderNew = await this.orderRepo.updateOrderStatusById(orderNumber, 'CONFIRMED')
        if (!orderNew) throw { code: 404, message: 'Order not found' }

        // Repo : get employee by branch id 
        const employees = await this.employeeRepo.findEmployeeByBranchId(order.branchId)

        if (employees !== null) {
            // Mailer : broadcast email to all admin store if a payment's evidence has been uploaded
            for (const dt of employees) {
                // Mailer : inform user that an order has been shipped
                const emailHtml = getOrderMailTemplate({
                    username: dt.user?.username ?? "",
                    orderNumber: orderNumber,
                    title: 'Order confirmed! 🎉',
                    content: "An order has been delivered to our beloved customer. Congrats!"
                })

                await Mailer.client.sendMail({
                    from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                    to: dt.user?.email,
                    subject: "Order is confirmed",
                    html: emailHtml,
                })
            }
        }
    }

    // For Task Scheduling / Cron
    async getUnprocessedOrdersToRemind() {
        // Repo : get processing branch order
        const branchs = await this.branchRepo.findBranchsOrders()
    
        for (const dt of branchs) {
            if (!dt.orders.length) continue
    
            // Remind every employee
            for (const emp of dt.employees) {
                if (!emp.user?.username) continue
    
                const emailHtml = getBranchOrderBroadcastTemplate({
                    username: emp.user.username,
                    storeName: dt.storeName,
                    schedules: dt.schedules,
                    orders: dt.orders
                })
    
                await Mailer.client.sendMail({
                    from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                    to: emp.user.email,
                    subject: `Branch Orders - ${dt.storeName}`,
                    html: emailHtml,
                })
            }
        }
    }

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

    async getExpiredOrder() {
        // Repo : get expired order
        await this.orderRepo.cancelExpiredUnpaidOrders()
    }

    async getOldShippedOrder() {
        // Repo : get order that has been shipped for more than n hours
        await this.orderRepo.confirmOldShippedOrder()
    }
}