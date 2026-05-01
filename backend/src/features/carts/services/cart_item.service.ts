import { CartRepository } from "../repositories/cart.repository"
import { CartItemRepository } from "../repositories/cart_item.repository"

export class CartItemService {
    private cartItemRepo = new CartItemRepository()
    private cartRepo = new CartRepository()

    async getCartItemQtyByProductIdBranchId(userId: string, productId: string, branchId: string) {
        return await this.cartItemRepo.findCartItemByProductIdBranchId(userId, productId, branchId)
    }

    async updateCartItemQty(userId: string, cartItemId: string, payload: { qty: number }) {
        let { qty } = payload

        // Repo : find cart item by id
        const cartItem = await this.cartItemRepo.findById(cartItemId)
        if (!cartItem) throw { code: 404, message: 'Cart item not found' }

        // Check if this cart belongs to user
        if (cartItem.cart.userId !== userId) throw { code: 403, message: 'Forbidden access to this cart item' }
    
        const stock = cartItem.product.currentStock

        // If result qty < 0, then invalid
        if (qty < 0) throw { code: 422, message: 'Invalid quantity update' }

        let updatedItem = null
        // If qty become 0, then delete item else just update
        if (qty === 0) {
            // Repo : get cart by id
            const cart = await this.cartRepo.findByIdAndUser(cartItem.cartId, userId)

            // Repo : delete cart item by id
            await this.cartItemRepo.deleteCartItemById(cartItemId)
            
            // Repo : delete cart by id
            if (cart?.items.length === 1) await this.cartRepo.deleteCartById(cartItem.cartId) 
        } else {
            // Make sure requested qty is less or equal stock
            if (qty > stock) throw { code: 422, message: 'Exceeds available stock' }

            // Repo : update cart item qty by id
            updatedItem = await this.cartItemRepo.updateCartItemQuantity(cartItemId, qty)
        }

        return { cartId: cartItem.cartId, cartItem: updatedItem }
    }

    async deleteCartItemById(userId: string, cartItemId: string) {
        // Repo : find cart item by id
        const cartItem = await this.cartItemRepo.findById(cartItemId)
        if (!cartItem) throw { code: 404, message: 'Cart item not found' }

        // Check if this cart belongs to user
        if (cartItem.cart.userId !== userId) throw { code: 403, message: 'Forbidden access to this cart item' }

        // Repo : get cart by id
        const cart = await this.cartRepo.findByIdAndUser(cartItem.cartId, userId)

        // Repo : delete cart item by id
        await this.cartItemRepo.deleteCartItemById(cartItemId)

        // Repo : delete cart by id
        if (cart && cart.items.length === 1) {
            await this.cartRepo.deleteCartById(cartItem.cartId) 

            return { isCartDeleted: true }
        } else {
            return { isCartDeleted: false }
        }
    }
}