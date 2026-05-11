import { useState } from "react"
import { cartRepository } from "../repositories/cart.repository"
import { useCartService } from "@/features/cart/services/cart.service"

export const useCreateCart = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createCart = async (branchId: string, productId: string, qty: number = 1): Promise<boolean> => {
        setIsCreating(true)
        setError(null)

        try {
            await cartRepository.createCart(branchId, productId, qty)
            // Auto-refresh cart summary so navbar badge updates
            useCartService.getState().fetchCartSummary()
            return true
        } catch (err: any) {
            setError(err.message || "Failed to create cart")
            return false
        } finally {
            setIsCreating(false)
        }
    }

    return { createCart, isCreating, error }
}