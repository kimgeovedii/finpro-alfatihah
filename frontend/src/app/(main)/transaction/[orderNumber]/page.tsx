"use client";
import { Button } from '@/components/ui/button';
import { OrderDetailBranchCard } from '@/features/order/components/OrderDetailBranchCard';
import { OrderDetailItemListCard } from '@/features/order/components/OrderDetailItemListCard';
import { PaymentSummaryCard } from '@/features/order/components/PaymentSummary';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, Package, Truck, Home } from "lucide-react"
import { OrderStatusStepsCard } from '@/features/order/components/OrderStatusStepsCard';
import { useCancelOrderStatusById, useConfirmOrderStatusById, useOrderDetailData } from '@/features/order/hooks/useOrder';
import { formatListSchedule } from '@/utils/converter.util';
import Swal from 'sweetalert2';
import { SkeletonBox } from '@/components/layout/SkeletonBox';
import { MessageBox } from '@/components/layout/MessageBox';

export default function TransactionDetailPage() {
  // For repo fetching
  const params = useParams()
  const orderNumber = params?.orderNumber as string
  const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)
  const { confirmOrder, isConfirmingOrder } = useConfirmOrderStatusById()
  const { cancelOrder, isCancellingOrder } = useCancelOrderStatusById()

  // Handle action
  const handleCancelOrder = async (orderNumber: string) => {
    const confirm = await Swal.fire({
      title: "Order Rejection",
      text: `Are you sure want to cancel this order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2d766f",
    })
    if (!confirm.isConfirmed) return 

    const { success, message } = await cancelOrder(orderNumber)
    await Swal.fire({
      title: success ? "Order cancel!" : "Opps!",
      text: message,
      icon: success ? "success" : "error",
      confirmButtonColor: "#10b981",
    })
  }

  const handleConfirmOrder = async (orderNumber: string) => {
    const confirm = await Swal.fire({
      title: "Order Confirmation",
      text: `Are you sure want to confirm this order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2d766f",
    })
    if (!confirm.isConfirmed) return 

    const { success, message } = await confirmOrder(orderNumber)
    await Swal.fire({
      title: success ? "Order confirm!" : "Opps!",
      text: message,
      icon: success ? "success" : "error",
      confirmButtonColor: "#10b981",
    })
  }

  // Order status state props
  const statusSteps = [
    {
      key: "WAITING_PAYMENT",
      label: "Order Placed",
      sub: "Waiting for payment",
      icon: <Check className="w-4 h-4"/>
    },
    {
      key: "PROCESSING",
      label: "Processed",
      sub: "Preparing your order",
      icon: <Package className="w-4 h-4"/>
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      sub: "On the way",
      icon: <Truck className="w-4 h-4"/>
    },
    {
      key: "CONFIRMED",
      label: "Delivered",
      sub: "Order completed",
      icon: <Home className="w-4 h-4"/>
    }
  ]
  
  // Format shop's schedule
  const scheduleText = order?.branch?.schedules ? formatListSchedule(order?.branch?.schedules) : '-'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto w-full">
      <div className='flex items-center gap-3 mb-5'>
        <Link href={'/transaction'}>
          <Button variant='destructive' className='text-md px-3 py-5'>
            <ArrowLeftIcon className="w-4 h-4"/> Back
          </Button>
        </Link>
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
                    <OrderStatusStepsCard 
                      statusSteps={statusSteps} 
                      currentStatus={order?.status && order?.status === "WAITING_PAYMENT_CONFIRMATION" ? "WAITING_PAYMENT" : order?.status ?? ""}
                      orderNumber={orderNumber}
                      onConfirm={handleConfirmOrder}
                      status={order?.status}
                    />
                    <OrderDetailBranchCard
                      branch={{
                        name: order?.branch?.storeName ?? "-",
                        address: `${order?.branch?.address}, ${order?.branch?.city}`,
                        schedule: scheduleText,
                        imageUrl: "/images/branch.jpg",
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
                    <OrderDetailItemListCard
                      branchName={order?.branch.storeName ?? '-'}
                      items={order?.items?.map(dt => ({
                        branchInventoriesId: dt.id,
                        id: dt.id,
                        slugName: dt.product.product.slugName,
                        weight: dt.product.product.weight * dt.quantity,
                        productName: dt.product.product.productName,
                        description: dt.product.product.description,
                        category: dt.product.product.category,
                        quantity: dt.quantity,
                        basePrice: dt.product.product.basePrice,
                        totalPrice: dt.product.product.basePrice * dt.quantity,
                        productImages: dt.product.product.productImages
                      })) ?? []}
                    />
                    <PaymentSummaryCard
                      orderNumber={orderNumber}
                      totalItem={order?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
                      shippingWeight={order?.totalWeight ?? 0}
                      shippingCost={order?.shippingCost ?? 0}
                      totalPrice={order?.totalPrice ?? 0}
                      totalSaving={0}
                      finalPrice={order?.finalPrice ?? 0} 
                      orderId={order?.id ?? '-'} 
                      status={order?.status ?? '-'} 
                      paymentDeadline={order?.paymentDeadline ?? '-'} 
                      paymentEvidence={order?.payments[0].evidence}
                      paymentMethod={order?.payments[0].method}
                      onCancel={handleCancelOrder}         
                    />
                  </>
                }
            </div>
          </div>
      }
    </div>
  )
}