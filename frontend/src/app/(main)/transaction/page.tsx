"use client";

import { useUser } from "@/features/auth/hooks/useUser"
import { OrderItemCard } from "@/features/cart/components/OrderItemCard";
import { useCart } from "@/features/cart/hooks/useCart"

export default function TransactionPage() {
  const { user } = useUser()
  const { summary, isLoading } = useCart()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            My History
          </h1>
          ...
          <hr className="my-5"/>
          <div>
            <OrderItemCard 
              orderNumber="ORD-001"
              status="WAITING_PAYMENT"
              totalPrice={50000}
              finalPrice={45000}
              shippingCost={10000}
              paymentDeadline="2026-04-15T12:00:00.000Z"
              totalItems={2}
              productList="Coca Cola, Sprite"
              createdAt="2026-04-14T08:00:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />

            <OrderItemCard 
              orderNumber="ORD-002"
              status="WAITING_PAYMENT_CONFIRMATION"
              totalPrice={75000}
              finalPrice={75000}
              shippingCost={15000}
              paymentDeadline="2026-04-14T10:00:00.000Z"
              totalItems={3}
              productList="Pepsi, Fanta"
              createdAt="2026-04-13T10:30:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />

            <OrderItemCard 
              orderNumber="ORD-003"
              status="PROCESSING"
              totalPrice={120000}
              finalPrice={110000}
              shippingCost={10000}
              paymentDeadline="2026-04-13T09:00:00.000Z"
              totalItems={5}
              productList="Mineral Water, Juice"
              createdAt="2026-04-12T14:20:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />

            <OrderItemCard 
              orderNumber="ORD-004"
              status="SHIPPED"
              totalPrice={90000}
              finalPrice={85000}
              shippingCost={5000}
              paymentDeadline="2026-04-12T08:00:00.000Z"
              totalItems={4}
              productList="Milk, Coffee"
              createdAt="2026-04-11T09:15:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />

            <OrderItemCard 
              orderNumber="ORD-005"
              status="CONFIRMED"
              totalPrice={65000}
              finalPrice={65000}
              shippingCost={10000}
              paymentDeadline="2026-04-10T07:00:00.000Z"
              totalItems={2}
              productList="Tea, Biscuit"
              createdAt="2026-04-09T16:45:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />

            <OrderItemCard 
              orderNumber="ORD-006"
              status="CANCELLED"
              totalPrice={40000}
              finalPrice={40000}
              shippingCost={8000}
              paymentDeadline="2026-04-08T06:00:00.000Z"
              totalItems={1}
              productList="Energy Drink"
              createdAt="2026-04-08T05:30:00.000Z"
              onComplete={() => console.log("complete")}
              onDetail={() => console.log("detail")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}