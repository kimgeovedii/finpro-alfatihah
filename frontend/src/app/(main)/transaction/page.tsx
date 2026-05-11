import { Suspense } from "react";
import { OrderLayout } from "@/features/order/components/OrderLayout";

export default function TransactionPage() {
  return (
    <Suspense>
      <OrderLayout/>
    </Suspense>
  )
}