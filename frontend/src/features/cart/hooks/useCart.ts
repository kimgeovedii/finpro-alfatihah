import { useEffect, useState } from "react"
import { useCartService } from "../services/cart.service"
import { cartRepository } from "../repositories/cart.repository"
import { CartBranch, CartData } from "../repositories/cart.type"
import { PaginationMeta } from "@/types/global.type"
import { closeLoading, showLoading } from "@/utils/message.util"

export const useCartSummary = () => {
    const { summary, fetchCartSummary, isLoading, error } = useCartService()

    useEffect(() => {
        fetchCartSummary()
    }, [])

    return { summary, isLoading, fetchCartSummary }
}

export const useAllCartData = () => {
    const [carts, setCarts] = useState<CartBranch[]>([])
    const [meta, setMeta] = useState<PaginationMeta | null>(null)
    const [isLoadingAllCart, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllCarts = async (page = 1) => {
        setIsLoading(true)
        setError(null)

        try {
            // Repo : Get all cart
            showLoading("Loading...")
            const res = await cartRepository.getAllCarts(page)
            closeLoading()

            setCarts((prev) => page === 1 ? res.data : [...prev, ...res.data])

            setMeta(res.meta)
        } catch (err: any) {
            setError(err.message || "Failed to fetch carts")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllCarts(1)
    }, [])

    return { carts, meta, isLoadingAllCart, error, fetchAllCarts }
}

export const useDeleteCart = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteCart = async (cartId: string): Promise<boolean> => {
        setIsDeleting(true)
        setError(null)

        try {
            // Repo : Delete cart by id
            showLoading("Removing cart...")
            await cartRepository.deleteCart(cartId)
            closeLoading()

            return true
        } catch (err: any) {
            setError(err.message || "Failed to delete cart")
            return false
        } finally {
            setIsDeleting(false)
        }
    }

    return { deleteCart, isDeleting, error }
}

export const useUpdateCartItem = () => {
    const [isUpdatingItem, setIsUpdating] = useState(false)
    const [errorUpdateItem, setError] = useState<string | null>(null)

    const updateCartItem = async (cartItemId: string, qty: number): Promise<boolean> => {
        setIsUpdating(true)
        setError(null)

        try {
            // Repo : Update cart item by id
            showLoading("Update cart item...")
            await cartRepository.updateCartItem(cartItemId, qty)
            closeLoading()

            return true
        } catch (err: any) {
            setError(err.message || "Failed to update cart item")
            return false
        } finally {
            setIsUpdating(false)
        }
    }

    return { updateCartItem, isUpdatingItem, errorUpdateItem }
}

export const useDeleteCartItem = () => {
    const [isDeletingItem, setIsDeletingItem] = useState(false)
    const [errorItem, setError] = useState<string | null>(null)

    const deleteCartItem = async (cartItemId: string): Promise<boolean> => {
        setIsDeletingItem(true)
        setError(null)

        try {
            // Repo : Delete cart item by id
            showLoading("Removing product...")
            await cartRepository.deleteCartItem(cartItemId)
            closeLoading()
            
            return true
        } catch (err: any) {
            setError(err.message || "Failed to delete cart item")
            return false
        } finally {
            setIsDeletingItem(false)
        }
    }

    return { deleteCartItem, isDeletingItem, errorItem }
}

export const useCartDetailData = (cartId: string) => {
    const [cart, setCart] = useState<CartData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCartDetail = async (cartId: string) => {
        setIsLoading(true)
        setError(null)

        try {
            // Repo : Get cart detail by id
            showLoading("Loading...")
            const res = await cartRepository.getCartDetailById(cartId)
            closeLoading()
            
            setCart(res)
        } catch (err: any) {
            setError(err?.message || "Failed to fetch cart")
            setCart(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (cartId) fetchCartDetail(cartId)
    }, [cartId])

    return { cart, isLoading, error, fetchCartDetail }
}

export const useCheckoutCartItem = () => {
    const [isCheckoutItem, setIsCheckoutItem] = useState(false)
    const [errorItem, setError] = useState<string | null>(null)

    const checkoutCartItem = async (cartId: string, addressId: string, paymentMethod: "MANUAL" | "GATEWAY", voucherId?: string): Promise<{ success: boolean, redirectUrl?: string }> => {
        setIsCheckoutItem(true)
        setError(null)

        try {
            // Repo : Create checkout
            showLoading("Preparing your order...")
            const res = await cartRepository.postCheckout(cartId, addressId, paymentMethod, voucherId)
            closeLoading()

            return { success: true, redirectUrl: res.redirectUrl }
        } catch (err: any) {
            setError(err.message || "Failed to checkout cart item")
            return { success: false }
        } finally {
            setIsCheckoutItem(false)
        }
    }

    return { checkoutCartItem, isCheckoutItem, errorItem }
}