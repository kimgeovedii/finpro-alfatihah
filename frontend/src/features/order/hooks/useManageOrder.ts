import { useEffect, useState } from "react"
import { orderRepository } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"
import { OrderStatus } from "@/constants/business.const"
import { ManagementOrderItem, ManagementOrderResponse } from "../repositories/order.type"

export const useOrderSummaryByBranchId = (branchId: string) => {
    const { summaryByBranchId, fetchOrderSummaryByBranchId, isLoadingSummaryByBranchId, error } = useOrderService()

    useEffect(() => {
        fetchOrderSummaryByBranchId(branchId)
    }, [branchId])

    return { summaryByBranchId, isLoadingSummaryByBranchId, error }
}

export const useOrderManagement = () => {
    const [orders, setOrders] = useState<ManagementOrderItem[]>([])
    const [meta, setMeta] = useState<ManagementOrderResponse["meta"] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<OrderStatus | "ALL">("ALL")
    const [page, setPage] = useState(1)
    const [branchId, setBranchId] = useState<string>("ALL")
    const [search, setSearch] = useState<string>("")

    const fetchOrders = async (nextPage: number, nextStatus: OrderStatus | "ALL", nextBranchId: string, nextSearch: string) => {
        setIsLoading(true)
        try {
            const res = await orderRepository.getAllOrdersByBranchId(nextPage, nextBranchId, nextStatus, nextSearch)
            setOrders(res.data)
            setMeta(res.meta)
        } catch (err) {
            console.error("Failed to fetch management orders", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders(page, status, branchId, search)
    }, [page, status, branchId, search])

    return { 
        orders, meta, isLoading, 
        status, setStatus,
        page, setPage,
        branchId, setBranchId,
        search, setSearch,
        fetchOrders
    }
}
