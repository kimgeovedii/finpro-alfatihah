"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderItemCard } from "@/features/order/components/OrderItemCard";
import { OrderSummaryCard } from "@/features/order/components/OrderSummaryCard";
import { useAllOrderData, useOrderSummary } from "@/features/order/hooks/useOrder";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Swal from "sweetalert2";

export default function TransactionPage() {
  const { summary, isLoadingSummary } = useOrderSummary()
  const { orders, meta, isLoading, fetchAllOrders } = useAllOrderData()

  // For filtering
  const [orderNumber, setOrderNumber] = useState("")
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const handleSearch = () => {
    if ((dateStart && !dateEnd) || (!dateStart && dateEnd)) {
      Swal.fire({
        title: "Filter failed",
        text: "dateStart and dateEnd must be provided together",
        icon: "error",
        confirmButtonColor: "#10b981",
      })

      return
    }

    fetchAllOrders(1, {
      orderNumber: orderNumber || undefined,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            My History
          </h1>
          {
            !isLoadingSummary && summary ? 
              <OrderSummaryCard 
                totalPrice={summary?.totalPrice ?? 0}
                totalFinalPrice={summary?.totalFinalPrice ?? 0}
                totalConfirmedOrder={summary?.ordersByStatus?.CONFIRMED ?? 0}
                totalProcessingOrder={(summary?.ordersByStatus?.PROCESSING ?? 0) + (summary?.ordersByStatus?.SHIPPED ?? 0)}
                totalWaitingOrder={(summary?.ordersByStatus?.WAITING_PAYMENT ?? 0) + (summary?.ordersByStatus?.WAITING_PAYMENT_CONFIRMATION ?? 0)}
                totalCancelledOrder={summary?.ordersByStatus?.CANCELLED ?? 0}
              />   
            : <p className="text-slate-400 mt-1">Loading...</p>
          }    
          <hr className="my-5"/>
          <div className="flex flex-wrap items-end gap-3 mb-5 bg-white p-3 rounded-xl">
            <div>
              <p className="text-xs text-slate-500 mb-1">Order Number</p>
              <Input placeholder="e.g. ORD-123" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-48 h-9 text-sm"/>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Start Date</p>
              <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="h-9 text-sm"/>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">End Date</p>
              <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="h-9 text-sm"/>
            </div>
            <Button onClick={handleSearch} className="h-9"><MagnifyingGlassIcon/> Search</Button>
          </div>
          <div>
            { isLoading && <p>Loading...</p> }
            {
              !isLoading && orders.map((dt, idx) => (
                <OrderItemCard
                  key={idx}
                  orderId={dt.id} orderNumber={dt.orderNumber} status={dt.status} totalPrice={dt.totalPrice} finalPrice={dt.finalPrice} shippingCost={dt.shippingCost}
                  paymentDeadline={dt.paymentDeadline} totalItems={dt.totalItems} productList={dt.productList} createdAt={dt.createdAt} paymentMethod={dt.payments[0]?.method}
                  paymentStatus={dt.payments[0]?.status} paymentEvidence={dt.payments[0]?.evidence}
                  onComplete={() => console.log("complete")}
                  onDetail={() => console.log("detail")}
                />
              ))
            }
            { meta && meta.page < meta.total_page && <Button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg" onClick={() => fetchAllOrders(meta.page + 1)}>See More</Button> }
          </div>
        </div>
      </div>
    </div>
  )
}