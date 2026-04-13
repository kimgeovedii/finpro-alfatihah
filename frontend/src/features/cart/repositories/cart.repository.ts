import { apiFetch } from "@/utils/api"

export type CartSummaryData = {
    totalItems: number
    totalQty: number
}

export const cartRepository = {
    async getSummary(): Promise<CartSummaryData> {
        return await apiFetch<CartSummaryData>("/carts/summary","get")
    }
}