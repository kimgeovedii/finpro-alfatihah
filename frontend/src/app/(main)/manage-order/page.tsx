'use client'
import { OrderTableSection } from "@/features/order/components/OrderManagementTable"
import { OrderSummaryByBranchCard } from "@/features/order/components/OrderSummaryByBranchCard"
import { useOrderSummary, useOrderSummaryByBranchId } from "@/features/order/hooks/useOrder"

export default function ManageOrdersPage() {
    const branchId = "c2c2f038-e002-4f18-a450-796848f5ce27" // for now
    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(branchId)

    const dummyOrders = [
        {
            id: "1",
            orderNumber: "ORD-1001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            createdAt: new Date().toISOString(),
            finalPrice: 250000,
            status: "PROCESSING" as const,
        },
        {
            id: "2",
            orderNumber: "ORD-1002",
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            createdAt: new Date().toISOString(),
            finalPrice: 500000,
            status: "WAITING_PAYMENT" as const,
        },
    ]

    const dummyMeta = {
        page: 1,
        limit: 10,
        total: 2,
        total_page: 1,
    }

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
                    orders={dummyOrders}
                    meta={dummyMeta}
                    isLoading={false}
                    onPageChange={(page) => console.log("Change page:", page)}
                    onSearch={(query) => console.log("Search query:", query)}
                />
                </div>
            </div>
        </div>
    )
}
