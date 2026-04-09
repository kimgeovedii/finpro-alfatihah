import { CartRepository } from "../repositories/cart.repository"
import { CartItemRepository } from "../repositories/cart_item.repository"
import { BranchInventoryRepository } from "../repositories/branch_inventory.repository"

export class CartService {
    private cartRepo = new CartRepository()
    private cartItemRepo = new CartItemRepository()
    private branchInventoryRepo = new BranchInventoryRepository()

    async addToCart(userId: string, payload: { productId: string, branchId: string, qty: number | null }) {
        let { productId, branchId, qty } = payload
        const finalQty = qty ?? 1

        // Service : check if product exist at specific branch
        const branchInventory = await this.branchInventoryRepo.findByProductAndBranch(productId, branchId)
        if (!branchInventory) throw { code: 404, message: 'Product not found in this branch' }

        // Make sure requested qty is less than current stock
        if (branchInventory.currentStock < finalQty) throw { code: 422, message: 'Invalid stock' }

        // Service : check if cart already exist
        let cart = await this.cartRepo.findByUserAndBranch(userId, branchId)

        // Service : create cart
        if (!cart) cart = await this.cartRepo.createCart(userId, branchId)

        // Service : check existing item in a cart
        const existingItem = await this.cartItemRepo.findByCartAndProduct(cart.id, branchInventory.id)

        // Service : create cart item if this is the first item in the cart. If already exist, just update the cart
        let cartItem = existingItem ? 
            await this.cartItemRepo.updateCartItemQuantity(existingItem.id, existingItem.quantity + finalQty)
        : 
            await this.cartItemRepo.createCartItem(cart.id, branchInventory.id, finalQty)

        return { cartId: cart.id, cartItem }
    }
}