import { apiFetch } from "@/utils/api"
import { CartBasedAddress, CartData, CartSummaryData } from "./cart.type"

export const cartRepository = {
    async getCartSummary(): Promise<CartSummaryData> {
        return await apiFetch<CartSummaryData>("/carts/summary","get")
    },
    async getAllCarts(addressId: string | null, coordinate: string | null): Promise<CartBasedAddress> {
        const query = new URLSearchParams({ ...(addressId && { addressId }), ...(coordinate && { coordinate })}).toString()
        return await apiFetch<CartBasedAddress>(`/carts${query ? `?${query}` : ""}`, "get")
    },
    async deleteCart(cartId: string): Promise<{ cartId: string }> {
        return await apiFetch<{ cartId: string }>(`/carts/delete/${cartId}`, "delete")
    },
    async deleteCartItem(cartItemId: string): Promise<{ cartItemId: string }> {
        return await apiFetch<{ cartItemId: string }>(`/carts/items/delete/${cartItemId}`, "delete")
    },
    async updateCartItem(cartItemId: string, qty: number) {
        return await apiFetch(`/carts/items/update-qty/${cartItemId}`, "put", { qty })
    },
    async getCartDetailById(cartId: string): Promise<CartData> {
        return await apiFetch<CartData>(`/carts/${cartId}`, "get")
    },
    async postCheckout(cartId: string, addressId: string, paymentMethod: "MANUAL" | "GATEWAY", voucherId?: string) {
        return await apiFetch<{ orderId: string, paymentId: string, snapToken?: string, redirectUrl?: string }>(
            "/orders/checkout", "post", { cartId, addressId, paymentMethod, ...(voucherId && { voucherId }) }
        )
    },
    async createCart(branchId: string, productId: string, qty: number = 1) {
        return await apiFetch<{ branchId: string, productId: string }>(
            "/carts/add-to-cart", "post", { branchId, productId, qty }
        )
    }
}