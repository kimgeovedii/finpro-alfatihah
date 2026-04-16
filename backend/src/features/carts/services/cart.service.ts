import { CartRepository } from "../repositories/cart.repository"
import { CartItemRepository } from "../repositories/cart_item.repository"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"
import { cronCartReminderMaxDays } from "../../../constants/feature.const"
import { Mailer } from "../../../config/mailer";
import { CartGroup, getCartReminderEmailTemplate } from "../views/cart.view";

export class CartService {
    private cartRepo = new CartRepository()
    private cartItemRepo = new CartItemRepository()
    private branchInventoryRepo = new BranchInventoryRepository()

    async getAllCarts(page: number, limit: number, userId: string, branchId: string | null) {
        return await this.cartRepo.findAllCarts(page, limit, userId, branchId)
    }

    async getCartSummary(userId: string, branchId: string | null) {
        return await this.cartRepo.getCartSummary(userId, branchId)
    }

    async getAllCartsToRemind() {
        // Repo : get all cart with max days
        const carts = await this.cartRepo.findAllCartsCron(cronCartReminderMaxDays)

        // View : mailer template for cart reminder broadcast
        for (const cart of carts) {
            const cartGroups: CartGroup[] = [{
                storeName: cart.branch.storeName,
                items: cart.items.map(item => ({
                    productName: item.product.product.productName,
                    quantity: item.quantity,
                    price: item.product.product.basePrice,
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
}