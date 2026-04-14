import { useEffect } from "react"
import { useCartService } from "../services/cart.service"

export const useCartSummary = () => {
    const { summary, fetchCartSummary, isLoading, error } = useCartService()

    useEffect(() => {
        fetchCartSummary()
    }, [])

    return { summary, isLoading, error }
}

export const useAllCartData = () => {
    const { carts, fetchAllCarts, isLoading } = useCartService()
  
    useEffect(() => {
        fetchAllCarts()
    }, [])
  
    return { carts, isLoading }
}