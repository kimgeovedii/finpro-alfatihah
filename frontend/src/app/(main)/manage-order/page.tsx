'use client'
import { SkeletonBox } from "@/components/layout/SkeletonBox"
import { OrderStatus } from "@/constants/business.const"
import { OrderTableItem, OrderManagementTable } from "@/features/order/components/OrderManagementTable"
import { OrderSummaryByBranchCard } from "@/features/order/components/OrderSummaryByBranchCard"
import { useOrderManagement, useOrderSummaryByBranchId } from "@/features/order/hooks/useOrder"
import { useUpdatePaymentStatusById } from "@/features/order/hooks/usePayment"
import Swal from "sweetalert2"

export default function ManageOrdersPage() {
    const branchId = "2474cec8-5a76-42c7-b5ed-dbd9e35d434c" // for now

    // Handle hook
    const { summaryByBranchId, isLoadingSummaryByBranchId } = useOrderSummaryByBranchId(branchId)
    const { orders, meta, isLoading, status, handlePageChange, handleStatusChange } = useOrderManagement(branchId)
    const { updatePayment, isUpdatingPayment } = useUpdatePaymentStatusById()

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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4">Manage Order</h1>
                    {
                        isLoadingSummaryByBranchId ?
                            // Render loading element
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
                    <hr className="my-4"/>
                    {
                        isLoading ? 
                            // Render loading element
                            <SkeletonBox extraClass={'min-h-[480px]'}/>
                        :
                            <OrderManagementTable
                                orders={tableOrders}
                                meta={meta}
                                isLoading={isLoading}
                                activeStatus={status}
                                onPageChange={handlePageChange}
                                onStatusChange={handleStatusChange}
                                onValidatePaymentEvidence={handleValidatePaymentEvidence}
                            />
                    }
                </div>
            </div>
        </div>
    )
}
