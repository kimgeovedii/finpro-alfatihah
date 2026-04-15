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

export type CartMeta = {
    page: number
    limit: number
    total: number
    total_page: number
}

export type CartResponse = {
    data: CartBranch[]
    meta: CartMeta
}

export const cartRepository = {
    async getCartSummary(): Promise<CartSummaryData> {
        return await apiFetch<CartSummaryData>("/carts/summary","get")
    },
    async getAllCarts(page: number = 1): Promise<CartResponse> {
        return await apiFetch<any>(`/carts?page=${page}`, "get")
    },
    async deleteCart(cartId: string): Promise<{ cartId: string }> {
        return await apiFetch<{ cartId: string }>(`/carts/delete/${cartId}`, "delete")
    }
}