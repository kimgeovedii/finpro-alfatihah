"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { OrderMatchingTable } from "@/features/order/components/OrderMatchingTable"
import { useCancelOrderStatusById, useOrderDetailData, useUpdateOrderStatusById } from "@/features/order/hooks/useOrder"
import Swal from "sweetalert2"

export default function ManageOrdersDetailPage() {
  const params = useParams()
  const orderNumber = params?.orderNumber as string
  const { order, isLoading, fetchOrderDetail } = useOrderDetailData(orderNumber)
  const { updateOrder, isUpdatingOrder } = useUpdateOrderStatusById()
  const { cancelOrder, isCancellingOrder } = useCancelOrderStatusById()

  const handleShippingOrder = async (orderNumber: string) => {
    const confirm = await Swal.fire({
      title: "Order Shipping",
      text: `Are you sure want to shipping this order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2d766f",
    })
    if (!confirm.isConfirmed) return

    const { success, message } = await updateOrder(orderNumber)
    await Swal.fire({
      title: success ? "Order shipped!" : "Opps!",
      text: message,
      icon: success ? "success" : "error",
      confirmButtonColor: "#10b981",
    })
  }

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
          confirmedAt={order?.confirmedAt}
          finalPrice={order?.finalPrice ?? 0}
          isLoading={isLoading}
          payments={order?.payments ?? []}
          onShipping={handleShippingOrder}
          onCancel={handleCancelOrder}
          branch={order?.branch}
          address={order?.address}
          status={order?.status}
          distance={order?.distance}
        />
      </div>
    </div>
  )
}