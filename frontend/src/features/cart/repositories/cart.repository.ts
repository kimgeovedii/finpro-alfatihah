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

// Cart Detail
export type CartDetailSchedule = {
    startTime: string
    endTime: string
    dayName: "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT"
}

export type CartDetailCategory = {
    id: string
    name: string
    slugName: string
    description: string
    createdAt: string
    updatedAt: string
}

export type CartDetailProductImage = {
    imageUrl: string
}

export type CartDetailProduct = {
    productName: string
    description: string
    basePrice: number
    category: CartDetailCategory
    productImages: CartDetailProductImage[]
}

export type CartDetailItem = {
    id: string
    quantity: number
    product: {
        product: CartDetailProduct
    }
}

export type CartDetailAddress = {
    id: string
    address: string
    lat: number
    long: number
    type: string
    label: string
    receiptName: string
    phone: string
    isPrimary: boolean
}

export type CartDetailBranch = {
    storeName: string
    latitude: number
    longitude: number
    address: string
    maxDeliveryDistance: number
    schedules: CartDetailSchedule[]
}

export type CartDetailShipping = {
    shippingCost: number
    distance: number
    courier: string
}

export type CartData = {
    branch: CartDetailBranch
    items: CartDetailItem[]
    user: {
        addresses: CartDetailAddress[]
    }
    totalBasePrice: number
    totalQty: number
    shipping: CartDetailShipping | null
    openStatus: string
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
    },
    async deleteCartItem(cartItemId: string): Promise<{ cartItemId: string }> {
        return await apiFetch<{ cartItemId: string }>(`/carts/items/delete/${cartItemId}`, "delete")
    },
    async updateCartItem(cartItemId: string, qty: number) {
        return await apiFetch(`/carts/items/update-qty/${cartItemId}`, "put", { qty })
    },
    async getCartDetailById(cartId: string): Promise<CartData> {
        return await apiFetch<CartData>(`/carts/${cartId}`, "get")
    }
}