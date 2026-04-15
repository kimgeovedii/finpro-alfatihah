"use client";

import { OrderItemCard } from "@/features/order/components/OrderItemCard";
import { OrderSummaryCard } from "@/features/order/components/OrderSummaryCard";
import { useAllOrderData, useOrderSummary } from "@/features/order/hooks/useOrder";

export default function TransactionPage() {
  const { summary, isLoadingSummary } = useOrderSummary()
  const { orders, meta, isLoading, fetchAllOrders } = useAllOrderData()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            My History
          </h1>
          <br/>
          {
            !isLoadingSummary && summary ? 
              <OrderSummaryCard 
                totalPrice={summary?.totalPrice ?? 0}
                totalFinalPrice={summary?.totalFinalPrice ?? 0}
                totalConfirmedOrder={summary?.ordersByStatus?.CONFIRMED ?? 0}
                totalProcessingOrder={
                  (summary?.ordersByStatus?.PROCESSING ?? 0) +
                  (summary?.ordersByStatus?.SHIPPED ?? 0)
                }
                totalWaitingOrder={
                  (summary?.ordersByStatus?.WAITING_PAYMENT ?? 0) +
                  (summary?.ordersByStatus?.WAITING_PAYMENT_CONFIRMATION ?? 0)
                }
                totalCancelledOrder={summary?.ordersByStatus?.CANCELLED ?? 0}
              />   
            : <p className="text-slate-400 mt-1">Loading...</p>
          }    
          <hr className="my-5"/>
          <div>
            { isLoading && <p>Loading...</p> }
            {
              !isLoading && orders.map((dt, idx) => (
                <OrderItemCard
                  key={idx}
                  orderNumber={dt.orderNumber} status={dt.status} totalPrice={dt.totalPrice} finalPrice={dt.finalPrice} shippingCost={dt.shippingCost}
                  paymentDeadline={dt.paymentDeadline} totalItems={dt.totalItems} productList={dt.productList} createdAt={dt.createdAt}
                  onComplete={() => console.log("complete")}
                  onDetail={() => console.log("detail")}
                />
              ))
            }
            { meta && meta.page < meta.total_page && <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg" onClick={() => fetchAllOrders(meta.page + 1)}>See More</button> }
          </div>
        </div>
      </div>
    </div>
  )
}