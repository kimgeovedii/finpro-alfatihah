import { apiFetch } from "@/utils/api"

export const cartItemRepository = {
    async deleteCartItem(cartItemId: string): Promise<{ cartItemId: string }> {
        return await apiFetch<{ cartItemId: string }>(`/carts/items/delete/${cartItemId}`, "delete")
    }
}