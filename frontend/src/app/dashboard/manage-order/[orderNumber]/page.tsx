import { OrderManageDetailLayout } from "@/features/order/components/OrderManageDetailLayout"

export default async function OrderManageDetailPage({ params }: { params: Promise<{ orderNumber: string }>}) {
  const { orderNumber } = await params

  return <OrderManageDetailLayout orderNumber={orderNumber}/>
}