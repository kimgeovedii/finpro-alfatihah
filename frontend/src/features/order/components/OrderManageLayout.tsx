'use client'
import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { SkeletonBox } from "@/components/layout/SkeletonBox"
import { useAuthStore } from "@/features/auth/store/useAuthStore"
import { OrderFiltersBar } from "@/features/order/components/OrderFiltersBar"
import { OrderManagementTable } from "@/features/order/components/OrderManagementTable"
import { OrderSummaryByBranchCard } from "@/features/order/components/OrderSummaryByBranchCard"
import { useAllBranchData } from "@/features/order/hooks/useBranch"
import { useOrderSummaryByBranchId } from "@/features/order/hooks/useManageOrder"
import { useManageOrderActions } from "@/features/order/hooks/useManageOrderAction"

export function OrderManageLayout() {
    // Call hook : data
    const role = useAuthStore((state) => state.user?.role)
    const { branchs, isBranchLoading } = useAllBranchData()

    // Call hook : actions
    const { branchId, setBranchId, search, setSearch, tableOrders, meta, isLoading, status, handlePageChange, handleStatusChange, handleValidatePaymentEvidence } = useManageOrderActions()

    // Call hook : summary (depends on branchId from actions)
    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(branchId)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <HeadingText level={1} children="Manage Order"/>
                    <div className="mt-2">
                    {
                        isLoadingSummaryByBranchId ?
                            <>
                                <div className="flex gap-4 w-full mb-4">
                                    <div className="flex-1">
                                        <SkeletonBox extraClass={'min-h-[160px]'}/>
                                    </div>
                                    <div className="w-72">
                                        <SkeletonBox extraClass={'min-h-[160px]'}/>
                                    </div>
                                    <div className="w-72">
                                        <SkeletonBox extraClass={'min-h-[160px]'}/>
                                    </div>
                                </div>
                            </>
                        :
                            <OrderSummaryByBranchCard
                                totalRevenue={summaryByBranchId?.totalRevenue ?? 0}
                                revenueChangePercent={summaryByBranchId?.revenueChangePercent ?? 0}
                                activeShipments={summaryByBranchId?.activeShipments ?? 0}
                                processingOrder={summaryByBranchId?.processingOrder ?? 0}
                                finishedOrder={summaryByBranchId?.finishedOrder ?? 0}
                                finishedOrderLastMonth={summaryByBranchId?.finishedOrderLastMonth ?? 0}
                            />
                    }
                    </div>
                    <DividerLine/>
                    <OrderFiltersBar
                        branchId={branchId}
                        onBranchChange={setBranchId}
                        branches={branchs}
                        isBranchLoading={isBranchLoading}
                        activeStatus={status}
                        onStatusChange={handleStatusChange}
                        search={search}
                        onSearchChange={setSearch}
                    />
                    {
                        isLoading ? 
                            <SkeletonBox extraClass={'min-h-[480px]'}/>
                        :
                            <OrderManagementTable
                                orders={tableOrders}
                                meta={meta}
                                isLoading={isLoading}
                                activeStatus={status}
                                onPageChange={handlePageChange}
                                onValidatePaymentEvidence={handleValidatePaymentEvidence}
                            />
                    }
                </div>
            </div>
        </div>
    )
}