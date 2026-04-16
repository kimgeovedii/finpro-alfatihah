import { useEffect, useState } from "react"
import { orderRepository, OrderData, OrderMeta } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"

export const useOrderSummary = () => {
    const { summary, fetchOrderSummary, isLoadingSummary, error } = useOrderService()

    useEffect(() => {
        fetchOrderSummary()
    }, [])

    return { summary, isLoadingSummary, error }
}

export const useAllOrderData = () => {
    const [orders, setOrders] = useState<OrderData[]>([])
    const [meta, setMeta] = useState<OrderMeta | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchAllOrders = async (page = 1) => {
        setIsLoading(true)

        try {
            const res = await orderRepository.getAllOrders(page)

            setOrders((prev) => page === 1 ? res.data : [...prev, ...res.data])

            setMeta(res.meta)
        } catch (err) {
            console.error("Failed to fetch orders", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllOrders(1)
    }, [])

    return { orders, meta, isLoading, fetchAllOrders }
}