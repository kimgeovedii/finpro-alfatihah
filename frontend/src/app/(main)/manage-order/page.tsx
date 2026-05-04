'use client'
import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { SkeletonBox } from "@/components/layout/SkeletonBox"
import { OrderStatus } from "@/constants/business.const"
import { useAuthStore } from "@/features/auth/store/useAuthStore"
import { OrderFiltersBar } from "@/features/order/components/OrderFiltersBar"
import { OrderTableItem, OrderManagementTable } from "@/features/order/components/OrderManagementTable"
import { OrderSummaryByBranchCard } from "@/features/order/components/OrderSummaryByBranchCard"
import { useAllBranchData } from "@/features/order/hooks/useBranch"
import { useOrderManagement, useOrderSummaryByBranchId } from "@/features/order/hooks/useOrder"
import { useUpdatePaymentStatusById } from "@/features/order/hooks/usePayment"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function ManageOrdersPage() {
    const role = useAuthStore((state) => state.user?.role)

    // Handle hook
    const [ branchId, setBranchId ] = useState<string>("ALL")
    const [ search, setSearch ] = useState<string>("")

    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(branchId)
    const { orders, meta, isLoading, status, handlePageChange, handleStatusChange, handleBranchChange } = useOrderManagement()
    const { updatePayment, isUpdatingPayment } = useUpdatePaymentStatusById()
    const { branchs, isBranchLoading } = useAllBranchData()

    // Sync branch
    useEffect(() => {
        handleBranchChange(branchId)
    }, [branchId])

    // Handle action
    const handleValidatePaymentEvidence = async (paymentId: string, isConfirm: boolean) => {
        const confirm = await Swal.fire({
            title: "Validate transaction?",
            text: `Are you sure want to ${isConfirm ? 'confirm' : 'reject'} this transaction?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2d766f",
        })
        if (!confirm.isConfirmed) return
    
        const success = await updatePayment(paymentId, isConfirm)
        if (success) {
            await Swal.fire({
                title: "Order validated!",
                text: "Your customer will receive notification as soon as possible",
                icon: "success",
                confirmButtonColor: "#10b981",
            })
        }
    }

    const tableOrders: OrderTableItem[] = orders.map(dt => ({
        id: dt.id,
        orderNumber: dt.orderNumber,
        storeName: dt.branch.storeName,
        customerName: dt.user.username,
        customerEmail: dt.user.email,
        createdAt: dt.createdAt,
        finalPrice: dt.finalPrice,
        payments: dt.payments,
        status: dt.status as OrderStatus,
    }))

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
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