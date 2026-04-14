import { apiFetch } from "@/utils/api"

export type CartSummaryData = {
    totalItems: number
    totalQty: number
}

export type CartItem = {
    id: string
    quantity: number
    product: {
        id: string
        currentStock: number
        product: {
            productName: string
            basePrice: number
            description: string
        }
    }
}

export type CartBranch = {
    id: string
    branchId: string
    branch: {
        id: string
        storeName: string
    }
    items: CartItem[]
}

export const cartRepository = {
    async getCartSummary(): Promise<CartSummaryData> {
        return await apiFetch<CartSummaryData>("/carts/summary","get")
    },
    async getAllCarts(): Promise<CartBranch[]> {
        const res = await apiFetch<any>("/carts", "get")
        
        return res.data.filter((cart: CartBranch) => cart.items.length > 0)
    }
}