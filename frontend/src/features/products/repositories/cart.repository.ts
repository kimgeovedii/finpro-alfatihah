import { apiFetch } from "@/utils/api"

export const cartRepository = {
    async createCart(branchId: string, productId: string, qty: number = 1) {
        return await apiFetch<{ branchId: string, productId: string }>(
            "/carts/add-to-cart", "post", { branchId, productId, qty }
        )
    }
}