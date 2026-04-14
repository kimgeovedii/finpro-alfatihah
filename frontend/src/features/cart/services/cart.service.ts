import { create } from "zustand"
import { CartBranch, cartRepository, CartSummaryData } from "../repositories/cart.repository"

type CartState = {
    summary: CartSummaryData | null
    isLoading: boolean
    error: string | null
    carts: CartBranch[]

    fetchCartSummary: () => Promise<void>
    fetchAllCarts: () => Promise<void>
}

export const useCartService = create<CartState>((set) => ({
    summary: null,
    carts: [],
    isLoading: false,
    error: null,

    fetchCartSummary: async () => {
        set({ isLoading: true, error: null })

        try {
            const data = await cartRepository.getCartSummary()

            set({ summary: data, isLoading: false })
        } catch (err: any) {
            set({
                error: err.message || "Failed to fetch cart summary",
                isLoading: false,
            })
        }
    },

    fetchAllCarts: async () => {
        set({ isLoading: true, error: null })

        try {
            const carts = await cartRepository.getAllCarts()

            set({ carts, isLoading: false })
        } catch (err: any) {
            set({
                error: err.message || "Failed to fetch carts",
                isLoading: false,
            })
        }
    }
}))