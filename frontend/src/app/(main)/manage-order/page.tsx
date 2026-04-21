'use client'
import { OrderTableStatus } from "@/constants/business.const"
import { OrderTableItem, OrderTableSection } from "@/features/order/components/OrderManagementTable"
import { OrderSummaryByBranchCard } from "@/features/order/components/OrderSummaryByBranchCard"
import { useOrderManagement, useOrderSummaryByBranchId } from "@/features/order/hooks/useOrder"

export default function ManageOrdersPage() {
    const branchId = "c2c2f038-e002-4f18-a450-796848f5ce27" // for now
    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(branchId)
    const { orders, meta, isLoading, status, handlePageChange, handleStatusChange } = useOrderManagement(branchId)

    const tableOrders: OrderTableItem[] = orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.user.username,
        customerEmail: o.user.email,
        createdAt: o.createdAt,
        finalPrice: o.finalPrice,
        status: o.status as OrderTableStatus,
    }))

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4">Manage Order</h1>
                    <OrderSummaryByBranchCard
                        totalRevenue={summaryByBranchId?.totalRevenue ?? 0}
                        revenueChangePercent={summaryByBranchId?.revenueChangePercent ?? 0}
                        activeShipments={summaryByBranchId?.activeShipments ?? 0}
                        processingOrder={summaryByBranchId?.processingOrder ?? 0}
                        finishedOrder={summaryByBranchId?.finishedOrder ?? 0}
                        finishedOrderLastMonth={summaryByBranchId?.finishedOrderLastMonth ?? 0}
                    />
                    <OrderTableSection
                        orders={tableOrders}
                        meta={meta}
                        isLoading={isLoading}
                        activeStatus={status}
                        onPageChange={handlePageChange}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
        </div>
    )
}
