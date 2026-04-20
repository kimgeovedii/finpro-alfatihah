'use client'
import { OrderTableSection } from "@/features/order/components/OrderManagementTable"

export default function ManageOrdersPage() {
    const dummyOrders = [
        {
            id: "1",
            orderNumber: "ORD-1001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            createdAt: new Date().toISOString(),
            finalPrice: 250000,
            status: "PROCESSING" as const,
        },
        {
            id: "2",
            orderNumber: "ORD-1002",
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            createdAt: new Date().toISOString(),
            finalPrice: 500000,
            status: "WAITING_PAYMENT" as const,
        },
    ]

    const dummyMeta = {
        page: 1,
        limit: 10,
        total: 2,
        total_page: 1,
    }

    return (
        <div className="space-y-6 w-full max-w-[1080px] mx-auto">
            <OrderTableSection
                orders={dummyOrders}
                meta={dummyMeta}
                isLoading={false}
                onPageChange={(page) => console.log("Change page:", page)}
                onSearch={(query) => console.log("Search query:", query)}
            />
        </div>
    )
}
