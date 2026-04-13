import { useEffect } from "react"
import { useCartService } from "../services/cart.service"

export const useCart = () => {
    const { summary, fetchSummary, isLoading, error } = useCartService()

    useEffect(() => {
        fetchSummary()
    }, [])

    return { summary, isLoading, error }
}