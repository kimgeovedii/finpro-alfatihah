import { useEffect, useState } from "react"
import { useCartService } from "../services/cart.service"
import { CartBranch, CartMeta, cartRepository } from "../repositories/cart.repository"

export const useCartSummary = () => {
    const { summary, fetchCartSummary, isLoading, error } = useCartService()

    useEffect(() => {
        fetchCartSummary()
    }, [])

    return { summary, isLoading, error }
}

export const useAllCartData = () => {
    const [carts, setCarts] = useState<CartBranch[]>([])
    const [meta, setMeta] = useState<CartMeta | null>(null)
    const [isLoadingAllCart, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllCarts = async (page = 1) => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await cartRepository.getAllCarts(page)

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