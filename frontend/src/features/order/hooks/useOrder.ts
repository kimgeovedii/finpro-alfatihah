import { useEffect, useState } from "react"
import { orderRepository } from "../repositories/order.repository"
import { useOrderService } from "../services/order.service"
import { CommandResult, PaginationMeta } from "@/types/global.type"
import { OrderData } from "../repositories/order.type"
import { closeLoading, showLoading } from "@/utils/message.util"

export const useOrderSummary = () => {
    const { summary, fetchOrderSummary, isLoadingSummary, error } = useOrderService()

    useEffect(() => {
        fetchOrderSummary()
    }, [])

    return { summary, isLoadingSummary, error }
}

export const useAllOrderData = () => {
    const [orders, setOrders] = useState<OrderData[]>([])
    const [meta, setMeta] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(false)
  
    const [filters, setFilters] = useState<{
        orderNumber?: string
        dateStart?: string
        dateEnd?: string
    }>({})
  
    const fetchAllOrders = async (page = 1, newFilters?: typeof filters) => {
        setIsLoading(true)
    
        try {
            const appliedFilters = newFilters ?? filters
            if (newFilters) setFilters(newFilters)
    
            // Repo : Get all order
            showLoading("Loading...")
            const res = await orderRepository.getAllOrders(page, appliedFilters)
            closeLoading()
    
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
            // Repo : Get order detail
            showLoading("Loading...")
            const res = await orderRepository.getOrderDetailByOrderNumber(orderNumber)
            closeLoading()

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
  
export const useUpdateOrderStatusById = () => {
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)
    const [errorUpdateOrder, setError] = useState<string | null>(null)
  
    const updateOrder = async (orderNumber: string): Promise<CommandResult> => {
        setIsUpdatingOrder(true)
        setError(null)
    
        try {
            // Repo : Update order by order number
            showLoading("Updating order...")
            const res = await orderRepository.postUpdateOrderStatusById(orderNumber)
            closeLoading()
    
            return { success: true, message: res?.message || "Order updated successfully" }
        } catch (err: any) {
            const message = err?.message || "Failed to update order"
            setError(message)
    
            return { success: false, message }
        } finally {
            setIsUpdatingOrder(false)
        }
    }
  
    return { updateOrder, isUpdatingOrder, errorUpdateOrder }
}

export const useCancelOrderStatusById = () => {
    const [isCancellingOrder, setIsCancellingOrder] = useState(false)
    const [errorCancelOrder, setError] = useState<string | null>(null)
  
    const cancelOrder = async (orderNumber: string): Promise<CommandResult> => {
        setIsCancellingOrder(true)
        setError(null)
    
        try {
            // Repo : Update cancel order by order number
            showLoading("Cancelling order...")
            const res = await orderRepository.postCancelOrderStatusById(orderNumber)
            closeLoading()
    
            return { success: true, message: res?.message || "Order cancel successfully" }
        } catch (err: any) {
            const message = err?.message || "Failed to cancel order"
            setError(message)
    
            return { success: false, message }
        } finally {
            setIsCancellingOrder(false)
        }
    }
  
    return { cancelOrder, isCancellingOrder, errorCancelOrder }
}

export const useConfirmOrderStatusById = () => {
    const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
    const [errorConfirmOrder, setError] = useState<string | null>(null)
  
    const confirmOrder = async (orderNumber: string): Promise<CommandResult> => {
        setIsConfirmingOrder(true)
        setError(null)
    
        try {
            // Repo : Update confirm order by order number
            showLoading("Confirming order...")
            const res = await orderRepository.postConfirmOrderStatusById(orderNumber)
            closeLoading()
    
            return { success: true, message: res?.message || "Order confirm successfully" }
        } catch (err: any) {
            const message = err?.message || "Failed to confirm order"
            setError(message)
    
            return { success: false, message }
        } finally {
            setIsConfirmingOrder(false)
        }
    }
  
    return { confirmOrder, isConfirmingOrder, errorConfirmOrder }
}