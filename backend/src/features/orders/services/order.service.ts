import { calculateShippingCost, isWithinDeliveryRange } from "../../../utils/location"
import { AddressRepository } from "../repositories/address.repository"
import { BranchRepository } from "../repositories/branch.repository"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"
import { CartRepository } from "../repositories/cart.repository"
import { OrderRepository } from "../repositories/order.repository"
import { PaymentRepository } from "../repositories/payment.repository"

export class OrderService {
    private orderRepo = new OrderRepository()
    private cartRepo = new CartRepository()
    private addressRepo = new AddressRepository()
    private branchRepo = new BranchRepository()
    private branchInventoryRepo = new BranchInventoryRepository()
    private paymentRepo = new PaymentRepository()

    async getAllOrders(page: number, limit: number, userId: string, branchId: string | null) {
        return await this.orderRepo.findAllOrders(page, limit, userId, branchId)
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
        const shippingCost = calculateShippingCost(address.lat, address.long, branch.latitude, branch.longitude)

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

        // Repo : update stock for each item in branch inventories
        await Promise.all(
            cart.items.map(item => this.branchInventoryRepo.decrementStock(item.product.id, item.quantity))
        )

        // Repo : delete cart and its items
        await this.cartRepo.deleteCart(cartId)

        // Repo : create stock journal Soon LOL ....

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
}