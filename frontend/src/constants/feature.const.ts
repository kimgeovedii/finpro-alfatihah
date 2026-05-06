import { OrderStatus } from "./business.const";

// For handling navigation
export const debouncerTimeLimit: number = 750

export const statusFilter: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "All Orders", value: "ALL" },
    { label: "Waiting Payment", value: "WAITING_PAYMENT" },
    { label: "Need Confirmation", value: "WAITING_PAYMENT_CONFIRMATION" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
]