"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { OrderMatchingTable } from "@/features/order/components/OrderMatchingTable"
import { useOrderDetailData } from "@/features/order/hooks/useOrder"

export default function ManageOrdersDetailPage() {
  const params = useParams()
  const orderNumber = params?.orderNumber as string
  const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/manage-order">
          <Button variant="destructive" className="text-md px-3 py-5">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>
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
              product: { 
                productName: dt.product.product.productName, 
                imageUrl: dt.product.product.productImages[0].imageUrl 
              },
            })) ?? []
          }
          shippingCost={order?.shippingCost ?? 0}
          finalPrice={order?.finalPrice ?? 0}
          isLoading={isLoading}
          payments={order?.payments ?? []}
        />
      </div>
    </div>
  )
}