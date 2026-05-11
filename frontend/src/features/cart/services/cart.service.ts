import { create } from "zustand"
import { cartRepository } from "../repositories/cart.repository"
import { CartSummaryData } from "../repositories/cart.type"

type CartState = {
    summary: CartSummaryData | null
    isLoading: boolean
    error: string | null

    fetchCartSummary: (addressId: string | null, coordinate: string | null) => Promise<void>
}

export const useCartService = create<CartState>((set) => ({
    summary: null,
    isLoading: false,
    error: null,

    fetchCartSummary: async (addressId: string | null, coordinate: string | null) => {
        set({ isLoading: true, error: null })

        try {
            const data = await cartRepository.getCartSummary(addressId, coordinate)

            set({ summary: data, isLoading: false })
        } catch (err: any) {
            set({
                error: err.message || "Failed to fetch cart summary",
                isLoading: false,
            })
        }
    }
}))