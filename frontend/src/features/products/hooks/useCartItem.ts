import { useState } from "react"
import { cartItemRepository } from "../repositories/cart_items.repository"

export const useDeleteCartItem = () => {
    const [isDeletingItem, setIsDeletingItem] = useState(false)
    const [errorItem, setError] = useState<string | null>(null)

    const deleteCartItem = async (cartItemId: string): Promise<boolean> => {
        setIsDeletingItem(true)
        setError(null)

        try {
            await cartItemRepository.deleteCartItem(cartItemId)
            return true
        } catch (err: any) {
            setError(err.message || "Failed to delete cart item")
            return false
        } finally {
            setIsDeletingItem(false)
        }
    }

    return { deleteCartItem, isDeletingItem, errorItem }
}