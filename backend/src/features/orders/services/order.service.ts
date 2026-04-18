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

export class OrderService {
    private orderRepo = new OrderRepository()
    private cartRepo = new CartRepository()
    private stockJournalRepo = new StockJournalRepository()
    private addressRepo = new AddressRepository()
    private branchRepo = new BranchRepository()
    private branchInventoryRepo = new BranchInventoryRepository()
    private paymentRepo = new PaymentRepository()
    private userRepo = new UserRepository()

    async getAllOrders(page: number, limit: number, userId: string, branchId: string | null) {
        return await this.orderRepo.findAllOrders(page, limit, userId, branchId)
    }

    async getOrderDetailByOrderNumber(userId: string, orderNumber: string) {
        return await this.orderRepo.findOrderDetailByOrderNumber(userId, orderNumber)
    }

    async getOrderSummary(userId: string) {
        return await this.orderRepo.getOrderSummary(userId)
    }

    async addCartToOrder(userId: string, payload: { cartId: string, voucherId?: string, addressId: string }) {
        const { cartId, addressId } = payload

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
        const payment = await this.paymentRepo.createPayment(order.id)

        // Repo : get user profile
        const user = await this.userRepo.findById(cart.userId)
        const orderMessageToBranch = `You got an order ${order.orderNumber} from ${user?.username}`

        await Promise.all(
            cart.items.map(async (item) => {
                // Repo : get branch inventory by id
                const branchInventory = await this.branchInventoryRepo.findById(item.product.id)
                if (!branchInventory) throw { code: 404, message: `Inventory not found` }
        
                const stockBefore: number = branchInventory.currentStock
                const stockAfter: number = stockBefore - item.quantity
                const quantityChange: number = item.quantity
        
                // Repo : update product qty
                await this.branchInventoryRepo.decrementStock(item.product.id, item.quantity)
        
                // Repo : create stock journal 
                await this.stockJournalRepo.createStockJournal(
                    branchInventory.productId, item.product.id, 'OUT', quantityChange, stockBefore, stockAfter, 'ORDER', order.id, orderMessageToBranch
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

        return { orderId: order.id, paymentId: payment.id }
    }

    async deleteOrderById(userId: string, orderId: string) {
        // Repo : find order by id
        const order = await this.orderRepo.findOrderById(orderId)
        if (!order) throw { code: 404, message: 'Order not found' }
    
        // Check if this order belongs to user
        if (order.userId !== userId) throw { code: 403, message: 'Forbidden access to this order' }
    
        // Repo : restore stock for each order item in branch inventories
        await Promise.all(
            order.items.map(item => this.branchInventoryRepo.incrementStock(item.productId, item.quantity))
        )
    
        // Repo : delete order 
        await this.orderRepo.deleteOrder(orderId)
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

    async getExpiredOrder() {
        // Repo : get expired order
        await this.orderRepo.cancelExpiredUnpaidOrders()
    }
}