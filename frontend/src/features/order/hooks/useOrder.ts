import { useEffect, useState } from "react"
import { orderRepository, OrderData } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"
import { PaginationMeta } from "@/types/global"

export const useOrderSummary = () => {
    const { summary, fetchOrderSummary, isLoadingSummary, error } = useOrderService()

    useEffect(() => {
        fetchOrderSummary()
    }, [])

    return { summary, isLoadingSummary, error }
}

export const useOrderSummaryByBranchId = (branchId: string) => {
    const { summaryByBranchId, fetchOrderSummaryByBranchId, isLoadingSummaryByBranchId, error } = useOrderService()

    useEffect(() => {
        fetchOrderSummaryByBranchId(branchId)
    }, [])

    return { summaryByBranchId, isLoadingSummaryByBranchId, error }
}

export const useAllOrderData = () => {
    const [orders, setOrders] = useState<OrderData[]>([])
    const [meta, setMeta] = useState<PaginationMeta | null>(null)
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

export const useOrderDetailData = (orderNumber: string) => {
    const [order, setOrder] = useState<OrderData>()
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrderDetail = async (orderNumber: string) => {
        setIsLoading(true)

        try {
            const res = await orderRepository.getOrderDetailByOrderNumber(orderNumber)

            setOrder(res)
        } catch (err) {
            console.error("Failed to fetch order", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderDetail(orderNumber)
    }, [])

    return { order, isLoading, fetchOrderDetail }
}