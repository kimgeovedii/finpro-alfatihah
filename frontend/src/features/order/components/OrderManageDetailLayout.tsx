"use client"
import { OrderMatchingTable } from "@/features/order/components/OrderMatchingTable"
import { useOrderDetailData } from "@/features/order/hooks/useOrder"
import { SkeletonBox } from "@/components/layout/SkeletonBox"
import { MessageBox } from "@/components/layout/MessageBox"
import { BackButton } from "@/components/button/BackButton"
import { HeadingText } from "@/components/layout/HeadingText"
import { useManageOrderActions } from "@/features/order/hooks/useManageOrderAction"
import { useAuthStore } from "@/features/auth/store/useAuthStore"

type Props = {
    orderNumber: string
}
  
export function OrderManageDetailLayout({ orderNumber }: Props) {
    // Handle hook (fetch)
    const employee = useAuthStore((state) => state.user?.employee)
    const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)
    
    // Handle hook (action)
    const onSuccess = () => fetchOrderDetail(orderNumber)
    const { handleShippingOrder, handleCancelOrder } = useManageOrderActions(employee?.role, employee?.branchId ?? "ALL", onSuccess)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
        <div className='flex gap-5 items-center'>
            <BackButton url="dashboard/manage-order"/>
            <HeadingText children="Transaction Detail" level={1}/>
        </div>
        {
            isLoading ? 
                // Render loading element
                <SkeletonBox extraClass={'min-h-[400px]'}/>
            :
            !order ? 
                // Render failed fetching condition
                <MessageBox context={'No order found'} image={"/assets/empty.png"} urlButton={'/dashboard/manage-order'} titleButton='Back to Order' description={`We're sorry, we cannot find <b>${orderNumber}</b> order. Double check your order number or contact our call center for more information`}/>
            :
                <div className="flex w-full">
                <OrderMatchingTable
                    orderNumber={orderNumber}
                    items={
                        order?.items?.map(dt => ({
                            id: dt.id,
                            quantity: dt.quantity,
                            price: dt.product.product.basePrice,
                            stockBefore: dt.product.currentStock,
                            stockAfter: dt.product.currentStock - dt.quantity,
                            product: { ...dt.product.product, imageUrl: dt.product.product.productImages[0].imageUrl },
                        })) ?? []
                    }
                    shippingCost={order?.shippingCost ?? 0}
                    confirmedAt={order?.confirmedAt}
                    shippedAt={order?.shippedAt}
                    finalPrice={order?.finalPrice ?? 0}
                    isLoading={isLoading}
                    payments={order?.payments ?? []}
                    onShipping={handleShippingOrder}
                    onCancel={handleCancelOrder}
                    branch={order?.branch}
                    address={order?.address}
                    status={order?.status}
                    distance={order?.distance}
                    role={employee?.role ?? ""}
                />
                </div>
        }
        </div>
    )
}