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
import { useOrderDetailData } from '@/features/order/hooks/useOrder';
import { formatListSchedule } from '@/utils/converter.util';

export default function TransactionDetailPage() {
  // For repo fetching
  const params = useParams()
  const orderNumber = params?.orderNumber as string
  const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)

  const statusSteps = [
    {
      key: "WAITING_PAYMENT",
      label: "Order Placed",
      sub: "Waiting for payment",
      icon: <Check className="w-4 h-4" />
    },
    {
      key: "PROCESSING",
      label: "Processed",
      sub: "Preparing your order",
      icon: <Package className="w-4 h-4" />
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      sub: "On the way",
      icon: <Truck className="w-4 h-4" />
    },
    {
      key: "CONFIRMED",
      label: "Delivered",
      sub: "Order completed",
      icon: <Home className="w-4 h-4" />
    }
  ]
  
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
      <div className='flex w-full gap-5'>
        <div className='flex-1 flex flex-col space-y-5'>
          <OrderStatusStepsCard statusSteps={statusSteps} currentStatus={order?.status && order?.status === "WAITING_PAYMENT_CONFIRMATION" ? "WAITING_PAYMENT" : order?.status ?? ""} />
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
              createdAt: order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-",
              paymentDeadlineAt: order?.paymentDeadline ? new Date(order.paymentDeadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-",
            }}
          />
        </div>
        <div className='flex-1 flex flex-col space-y-5'>
          <OrderDetailItemListCard
            items={order?.items?.map(item => ({
              branchInventoriesId: item.id,
              productName: item.product.product.productName,
              description: item.product.product.description,
              category: "-",
              imageUrl: item.product.product.productImages?.[0]?.imageUrl ?? "",
              quantity: item.quantity,
              basePrice: item.product.product.basePrice,
              totalPrice: item.product.product.basePrice * item.quantity,
            })) ?? []}
          />
          <PaymentSummaryCard
            totalItem={order?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
            shippingCost={order?.shippingCost ?? 0}
            totalPrice={order?.totalPrice ?? 0}
            totalSaving={0}
            finalPrice={order?.finalPrice ?? 0}
          />
        </div>
      </div>
    </div>
  )
}