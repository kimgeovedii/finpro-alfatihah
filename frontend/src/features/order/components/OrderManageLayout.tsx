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
import { useEffect } from "react"

export function OrderManageLayout() {
    // Call hook (fetch)
    const employee = useAuthStore((state) => state.user?.employee)
    const { branchs, isBranchLoading } = useAllBranchData()

    // Call hook (action)
    const { page, fetchOrders, branchId, setBranchId, search, setSearch, tableOrders, meta, isLoading, status, handlePageChange, handleStatusChange, handleValidatePaymentEvidence} = useManageOrderActions(employee?.role, employee?.branchId ?? "ALL")

    useEffect(() => {
        fetchOrders(page, status, branchId, search)
    }, [page, status, branchId])
    
    // Call hook (fetch)
    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(employee?.role === "SUPER_ADMIN" ? branchId : employee?.branchId ?? branchId)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <HeadingText level={1} children="Manage Order"/>
                    <p className="text-slate-500 mt-1">You can manage all customer transactions on this page, including viewing incoming orders, accepting or rejecting payments, validating shipping, and tracking completion.</p>
                    <div className="mt-4">
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
                        branchId={employee?.role === "SUPER_ADMIN" ? branchId : employee?.branchId ?? branchId}
                        onBranchChange={setBranchId}
                        branches={branchs}
                        isBranchLoading={isBranchLoading}
                        activeStatus={status}
                        onStatusChange={handleStatusChange}
                        search={search}
                        onSearchChange={setSearch}
                        isFilterBranchDisabled={employee?.role === "SUPER_ADMIN" ? false : true }
                    />
                    {
                        isLoading ? 
                            <SkeletonBox extraClass={'min-h-[480px]'}/>
                        :
                            <OrderManagementTable
                                orders={tableOrders}
                                meta={meta}
                                role={employee?.role ?? ""}
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