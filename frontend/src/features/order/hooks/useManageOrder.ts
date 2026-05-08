import { useEffect, useState } from "react"
import { orderRepository } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"
import { OrderStatus } from "@/constants/business.const"
import { ManagementOrderItem, ManagementOrderResponse } from "../repositories/order.type"
import { closeLoading, showLoading } from "@/utils/message.util"

export const useOrderSummaryByBranchId = (branchId: string) => {
    const { summaryByBranchId, fetchOrderSummaryByBranchId, isLoadingSummaryByBranchId, error } = useOrderService()

    useEffect(() => {
        // State : Fetch summary from global state by branch id
        fetchOrderSummaryByBranchId(branchId)
    }, [branchId])

    return { summaryByBranchId, isLoadingSummaryByBranchId, error }
}

export const useOrderManagement = (defaultBranchId: string = "ALL") => {    const [orders, setOrders] = useState<ManagementOrderItem[]>([])
    const [meta, setMeta] = useState<ManagementOrderResponse["meta"] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<OrderStatus | "ALL">("ALL")
    const [page, setPage] = useState(1)
    const [branchId, setBranchId] = useState<string>(defaultBranchId)
    const [search, setSearch] = useState<string>("")

    const fetchOrders = async (nextPage: number, nextStatus: OrderStatus | "ALL", nextBranchId: string, nextSearch: string) => {
        setIsLoading(true)
        try {
            // Repo : get all order by branch
            showLoading("Loading...")
            const res = await orderRepository.getAllOrdersByBranchId(nextPage, nextBranchId, nextStatus, nextSearch)
            closeLoading()

            setOrders(res.data)
            setMeta(res.meta)
            closeLoading()
        } catch (err) {
            console.error("Failed to fetch management orders", err)
        } finally {
            setIsLoading(false)
        }
    }

    return { orders, meta, isLoading, status, setStatus, page, setPage, branchId, setBranchId, search, setSearch, fetchOrders }
}
