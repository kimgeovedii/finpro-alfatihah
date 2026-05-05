import { OrderDetailLayout } from "@/features/order/components/OrderDetailLayout";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }>}) {
  const { orderNumber } = await params

  return <OrderDetailLayout orderNumber={orderNumber}/>
}