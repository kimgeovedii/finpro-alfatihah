"use client";
import { OrderDetailBranchCard } from '@/features/order/components/OrderDetailBranchCard';
import { OrderDetailItemListCard } from '@/features/order/components/OrderDetailItemListCard';
import { PaymentSummaryCard } from '@/features/order/components/PaymentSummary';
import { OrderStatusStepsCard } from '@/features/order/components/OrderStatusStepsCard';
import { useOrderDetailData } from '@/features/order/hooks/useOrder';
import { SkeletonBox } from '@/components/layout/SkeletonBox';
import { MessageBox } from '@/components/layout/MessageBox';
import { BackButton } from '@/components/button/BackButton';
import { HeadingText } from '@/components/layout/HeadingText';
import { useOrderActions } from '@/features/order/hooks/useOrderAction';
import { ArchiveBoxIcon, CheckIcon, HomeIcon, TruckIcon } from '@heroicons/react/24/outline';

type Props = {
    orderNumber: string
}
  
export function OrderDetailLayout({ orderNumber }: Props) {
    // Handle hook (fetch)
    const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)
    
    // Handle hook (action)
    const onSuccess = () => fetchOrderDetail(orderNumber)
    const { handleCancelOrder, handleConfirmOrder } = useOrderActions(() => {}, onSuccess)

    // Order status state props
    const statusSteps = [
        {
            key: "WAITING_PAYMENT",
            label: "Order Placed",
            sub: "Waiting for payment",
            icon: <CheckIcon className="w-4 h-4"/>
        },
        {
            key: "PROCESSING",
            label: "Processed",
            sub: "Preparing your order",
            icon: <ArchiveBoxIcon className="w-4 h-4"/>
        },
        {
            key: "SHIPPED",
            label: "Shipped",
            sub: "On the way",
            icon: <TruckIcon className="w-4 h-4"/>
        },
        {
            key: "CONFIRMED",
            label: "Delivered",
            sub: "Order completed",
            icon: <HomeIcon className="w-4 h-4"/>
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto w-full">
        <div className='flex gap-5 items-center'>
            <BackButton url="transaction"/>
            <HeadingText children="Transaction Detail" level={1}/>
        </div>
        {
            !isLoading && (!order || order?.payments.length === 0 ) ?
                // Render failed fetching condition
                <MessageBox context={'No order found'} image={"/assets/empty.png"} urlButton={'/transaction'} titleButton='Back to Order' description={`We're sorry, we cannot find <b>${orderNumber}</b> order. Double check your order number or contact our call center for more information`}/>
            :
                <div className='flex flex-col lg:flex-row w-full gap-5'>
                    <div className='w-full lg:flex-1 flex flex-col space-y-5'>
                    {
                        isLoading ?
                        // Render loading element
                        <>
                            <SkeletonBox extraClass={'min-h-[260px]'}/>
                            <SkeletonBox extraClass={'min-h-[400px]'}/>
                        </>
                        :
                        <>
                            {
                                // Payment summary comes first if waiting for payment / confirmation
                                (order?.status === "WAITING_PAYMENT" || order?.status === "WAITING_PAYMENT_CONFIRMATION") &&
                                    <PaymentSummaryCard
                                        orderNumber={orderNumber}
                                        totalItem={order?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
                                        shippingWeight={order?.totalWeight ?? 0}
                                        shippingCost={order?.shippingCost ?? 0}
                                        totalPrice={order?.totalPrice ?? 0}
                                        totalSaving={(order?.totalPrice ?? 0) - (order?.finalPrice ?? 0)}
                                        finalPrice={order?.finalPrice ?? 0} 
                                        orderId={order?.id ?? '-'} 
                                        status={order?.status ?? '-'} 
                                        paymentDeadline={order?.paymentDeadline ?? '-'} 
                                        paymentEvidence={order?.payments[0].evidence}
                                        paymentMethod={order?.payments[0].method}
                                        onCancel={handleCancelOrder} 
                                        onSuccess={onSuccess}        
                                    />
                            }
                            {
                                // Order status comes first if payment has done
                                order?.status !== "WAITING_PAYMENT" && order?.status !== "WAITING_PAYMENT_CONFIRMATION" &&
                                    <OrderStatusStepsCard 
                                        statusSteps={statusSteps} 
                                        currentStatus={order?.status && order?.status === "WAITING_PAYMENT_CONFIRMATION" ? "WAITING_PAYMENT" : order?.status ?? ""}
                                        orderNumber={orderNumber}
                                        onConfirm={handleConfirmOrder}
                                        status={order?.status}
                                    />
                            }
                            <OrderDetailBranchCard
                                branch={{
                                    storeName: order?.branch?.storeName ?? "-",
                                    address: order?.branch?.address ?? "-",
                                    schedules: order?.branch?.schedules ?? [],
                                    city: order?.branch?.city ?? "-",
                                    openStatus: order?.branch.openStatus
                                }}
                                orderInfo={{
                                    orderNumber,
                                    orderStatus: order?.status ?? "-",
                                    paymentStatus: order?.payments[0].status ?? '-',
                                    paymentMethod: order?.payments[0].method ?? '-',
                                    createdAt: order?.createdAt,
                                    paymentDeadline: order?.paymentDeadline,
                                }}
                            />
                        </>
                    }
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col space-y-5'>
                    {
                        isLoading ?
                            // Render loading element
                            <>
                                <SkeletonBox extraClass={'min-h-[260px]'}/>
                                <SkeletonBox extraClass={'min-h-[260px]'}/>
                            </>
                        :
                            <>
                                {
                                    // Order status comes second if waiting for payment / confirmation
                                    (order?.status === "WAITING_PAYMENT" || order?.status === "WAITING_PAYMENT_CONFIRMATION") &&
                                        <OrderStatusStepsCard 
                                            statusSteps={statusSteps} 
                                            currentStatus={order?.status && order?.status === "WAITING_PAYMENT_CONFIRMATION" ? "WAITING_PAYMENT" : order?.status ?? ""}
                                            orderNumber={orderNumber}
                                            onConfirm={handleConfirmOrder}
                                            status={order?.status}
                                        />
                                }
                                <OrderDetailItemListCard
                                    branchName={order?.branch.storeName ?? '-'}
                                    items={
                                        order?.items?.map(dt => ({
                                            branchInventoriesId: dt.id,
                                            ...dt.product.product,
                                            id: dt.id,
                                            quantity: dt.quantity,
                                            basePrice: dt.price,
                                            weight: dt.product.product.weight * dt.quantity,
                                            totalPrice: dt.product.product.basePrice * dt.quantity,
                                        })) ?? []
                                    }
                                />
                                {
                                    // Payment summary comes last if payment has done
                                    order?.status !== "WAITING_PAYMENT" && order?.status !== "WAITING_PAYMENT_CONFIRMATION" &&
                                        <PaymentSummaryCard
                                            orderNumber={orderNumber}
                                            totalItem={order?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
                                            shippingWeight={order?.totalWeight ?? 0}
                                            shippingCost={order?.shippingCost ?? 0}
                                            totalPrice={order?.totalPrice ?? 0}
                                            totalSaving={(order?.totalPrice ?? 0) - (order?.finalPrice ?? 0)}
                                            finalPrice={order?.finalPrice ?? 0} 
                                            orderId={order?.id ?? '-'} 
                                            status={order?.status ?? '-'} 
                                            paymentDeadline={order?.paymentDeadline ?? '-'} 
                                            paymentEvidence={order?.payments[0].evidence}
                                            paymentMethod={order?.payments[0].method}
                                            onCancel={handleCancelOrder} 
                                            onSuccess={onSuccess}        
                                        />
                                }
                            </>
                        }
                    </div>
                </div>
        }
        </div>
    )
}