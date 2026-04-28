import { CartRepository } from "../repositories/cart.repository"
import { CartItemRepository } from "../repositories/cart_item.repository"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"
import { cronCartReminderMaxDays } from "../../../constants/feature.const"
import { Mailer } from "../../../config/mailer";
import { CartGroup, getCartReminderEmailTemplate } from "../views/cart.view";
import { courierShippingDefault, weightGramsShippingDefault } from "../../../constants/business.const";
import { isWithinDeliveryRange } from "../../../utils/location";
import { getCityIdFromCoords, getShippingCost } from "../../../utils/shipping";
import { getStoreOpenStatus } from "../../../utils/business";

export class CartService {
    private cartRepo = new CartRepository()
    private cartItemRepo = new CartItemRepository()
    private branchInventoryRepo = new BranchInventoryRepository()

    async getAllCarts(page: number, limit: number, userId: string, branchId: string | null) {
        return await this.cartRepo.findAllCarts(page, limit, userId, branchId)
    }

    async getCartDetailById(userId: string, cartId: string, addressId: string | null) {
        // Repo : get cart detail by id
        let cart = await this.cartRepo.findCartById(userId, cartId)
        if (!cart) throw { code: 404, message: 'Cart not found' }
        
        let shipping = null
        let addressList = cart.user.addresses.length
    
        if (addressId || addressList > 0) {
            const courier = courierShippingDefault
            shipping = {
                shippingCost: 0,
                distance: 0,
                courier
            }
            if (addressId && addressList === 0 ) throw { code: 404, message: 'Address not found' }
    
            let selectedAddress = null
            const branchLat = cart.branch.latitude
            const branchLong = cart.branch.longitude
            // Total weight (g)
            const totalWeight = cart.items.reduce((sum, dt) => sum + dt.product.product.weight, 0)
    
            // If address provided just take it 
            if (addressId) selectedAddress = cart.user.addresses.find(a => a.id === addressId)
            if (!selectedAddress && addressId) throw { code: 404, message: 'Address not found' }
    
            // If address not provided. Find primary or nearest valid
            if (!selectedAddress && addressList > 0) {
                const primaryAddress = cart.user.addresses.find(a => a.isPrimary)
    
                // Try primary first
                if (primaryAddress) {
                    const rangeValidate = isWithinDeliveryRange(primaryAddress.lat, primaryAddress.long, branchLat, branchLong, cart.branch.maxDeliveryDistance)
    
                    if (rangeValidate.isInsideRange) {
                        selectedAddress = {
                            ...primaryAddress,
                            distance: rangeValidate.distance
                        }
                        shipping.distance = rangeValidate.distance
                    }
                }
    
                // If primary not valid, fallback to nearest valid
                if (!selectedAddress) {
                    const validAddresses = cart.user.addresses
                        .map(dt => {
                            const rangeValidate = isWithinDeliveryRange(dt.lat, dt.long, branchLat, branchLong, cart.branch.maxDeliveryDistance)
    
                            return {
                                ...dt,
                                distance: rangeValidate.distance,
                                isInsideRange: rangeValidate.isInsideRange
                            }
                        })
                        .filter(dt => dt.isInsideRange)
                        .sort((a, b) => a.distance - b.distance)
    
                    if (validAddresses.length === 0) throw { code: 422, message: 'None of your address in shipping range' }
    
                    selectedAddress = validAddresses[0]
                    shipping.distance = selectedAddress.distance
                }
            }
    
            if (selectedAddress) {
                const addressLat = selectedAddress.lat
                const addressLong = selectedAddress.long
    
                // Helper : validate if user address is within branch max delivery distance
                const rangeValidate = isWithinDeliveryRange(addressLat, addressLong, branchLat, branchLong, cart.branch.maxDeliveryDistance)
                const range = rangeValidate.distance.toFixed()
                if (!rangeValidate.isInsideRange) throw { code: 422, message: `Delivery address is outside the branch delivery range. Your distance to our branch is ${range} Km` }
    
                // Helper : calculate shipping cost based on distance
                const [originId, destinationId] = await Promise.all([
                    getCityIdFromCoords(branchLat, branchLong),
                    getCityIdFromCoords(addressLat, addressLong)
                ])
            
                // Helper : get shipping cost from Raja Ongkir + Opencage
                const shippingCost = await getShippingCost(originId, destinationId, totalWeight)
    
                shipping.shippingCost = shippingCost
                shipping.distance = rangeValidate.distance
            } else {
                throw { code: 422, message: 'Your address invalid' }
            }
        }

        // Helper : get store open status by schedule and current server time
        const openStatus = getStoreOpenStatus(cart.branch.schedules)
    
        return { ...cart, shipping, openStatus }
    }

    async getCartSummary(userId: string, branchId: string | null) {
        return await this.cartRepo.getCartSummary(userId, branchId)
    }

    async addToCart(userId: string, payload: { productId: string, branchId: string, qty: number | null }) {
        let { productId, branchId, qty } = payload
        const finalQty = qty ?? 1

        // Repo : check if product exist at specific branch
        const branchInventory = await this.branchInventoryRepo.findByProductAndBranch(productId, branchId)
        if (!branchInventory) throw { code: 404, message: 'Product not found in this branch' }

        // Make sure requested qty is less than current stock
        if (branchInventory.currentStock < finalQty) throw { code: 422, message: 'Invalid stock' }

        // Repo : check if cart already exist
        let cart = await this.cartRepo.findByUserAndBranch(userId, branchId)

        // Repo : create cart
        if (!cart) cart = await this.cartRepo.createCart(userId, branchId)

        // Repo : check existing item in a cart
        const existingItem = await this.cartItemRepo.findByCartAndProduct(cart.id, branchInventory.id)

        // Repo : create cart item if this is the first item in the cart. If already exist, just update the cart
        let cartItem = existingItem ? 
            await this.cartItemRepo.updateCartItemQuantity(existingItem.id, existingItem.quantity + finalQty)
        : 
            await this.cartItemRepo.createCartItem(cart.id, branchInventory.id, finalQty)

        return { cartId: cart.id, cartItem }
    }

    async deleteCartById(userId: string, cartId: string) {
        // Repo : find cart and validate ownership
        const cart = await this.cartRepo.findByIdAndUser(cartId, userId)
        if (!cart) throw { code: 404, message: 'Cart not found' }
    
        // Repo : delete cart items
        await this.cartItemRepo.deleteByCartId(cartId)
    
        // Repo : delete cart
        await this.cartRepo.deleteCartById(cartId)
    
        return { cartId }
    }

    // For Task Scheduling / Cron
    async getAllCartsToRemind() {
        // Repo : get all cart with max days
        const carts = await this.cartRepo.findAllCartsCron(cronCartReminderMaxDays)

        // View : mailer template for cart reminder broadcast
        for (const cart of carts) {
            const cartGroups: CartGroup[] = [{
                storeName: cart.branch.storeName,
                items: cart.items.map(dt => ({
                    productName: dt.product.product.productName,
                    quantity: dt.quantity,
                    price: dt.product.product.basePrice,
                }))
            }]
    
            const emailHtml = getCartReminderEmailTemplate(cart.user.username ?? "Customer", cartGroups)
    
            await Mailer.client.sendMail({
                from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                to: cart.user.email,
                subject: "My Cart - Alfatihah Apps",
                html: emailHtml,
            })
        }
    }
}