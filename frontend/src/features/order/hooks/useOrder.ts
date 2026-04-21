import { useEffect, useState } from "react"
import { orderRepository } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"
import { PaginationMeta } from "@/types/global.type"
import { OrderStatus } from "@/constants/business.const"
import { ManagementOrderItem, ManagementOrderResponse, OrderData } from "../repositories/order.type"

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

export const useOrderManagement = (branchId: string) => {
    const [orders, setOrders] = useState<ManagementOrderItem[]>([])
    const [meta, setMeta] = useState<ManagementOrderResponse["meta"] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<OrderStatus | "ALL">("ALL")
    const [page, setPage] = useState(1)

    const fetchOrders = async (nextPage: number, nextStatus: OrderStatus | "ALL") => {
        setIsLoading(true)
        try {
            const res = await orderRepository.getAllOrdersByBranchId(nextPage, branchId, nextStatus)
            setOrders(res.data)
            setMeta(res.meta)
        } catch (err) {
            console.error("Failed to fetch management orders", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders(page, status)
    }, [page, status])

    const handlePageChange = (nextPage: number) => setPage(nextPage)
    const handleStatusChange = (nextStatus: OrderStatus | "ALL") => {
        setPage(1)
        setStatus(nextStatus)
    }

    return { orders, meta, isLoading, status, page, handlePageChange, handleStatusChange }
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