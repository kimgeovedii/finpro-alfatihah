import { CartItemRepository } from "../repositories/cart_item.repository"

export class CartItemService {
    private cartItemRepo = new CartItemRepository()

    async updateCartItemQty(userId: string, cartItemId: string, payload: { qty: number }) {
        let { qty } = payload

        // Repo : find cart item by id
        const cartItem = await this.cartItemRepo.findById(cartItemId)
        if (!cartItem) throw { code: 404, message: 'Cart item not found' }

        // Check if this cart belongs to user
        if (cartItem.cart.userId !== userId) throw { code: 403, message: 'Forbidden access to this cart item' }
    
        const currentQty = cartItem.quantity
        const stock = cartItem.product.currentStock

        // Calculate new qty
        const newQty = currentQty - qty

        // If result qty < 0, then invalid
        if (newQty < 0) throw { code: 422, message: 'Invalid quantity update' }

        let updatedItem = null
        // If qty become 0, then delete item else just update
        if (newQty === 0) {
            // Repo : delete cart item by id
            await this.cartItemRepo.deleteCartItem(cartItemId)
        } else {
            // Make sure requested qty is less or equal stock
            if (newQty > stock) throw { code: 422, message: 'Exceeds available stock' }

            // Repo : update cart item qty by id
            updatedItem = await this.cartItemRepo.updateCartItemQuantity(cartItemId, newQty)
        }

        return { cartId: cartItem.cartId, cartItem: updatedItem }
    }
}