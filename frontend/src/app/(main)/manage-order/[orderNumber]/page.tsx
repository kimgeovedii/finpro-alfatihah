"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { OrderMatchingTable } from "@/features/order/components/OrderMatchingTable"

export default function ManageOrdersDetailPage() {
  const params = useParams()
  const orderNumber = params?.orderNumber as string

  const dummyItems = [  
    {
      id: "1",
      quantity: 20,
      price: 10000,
      stockBefore: 30,
      stockAfter: 10,
      product: { productName: "Coca Cola", imageUrl: "" },
    },
    {
      id: "2",
      quantity: 5,
      price: 25000,
      stockBefore: 3,
      stockAfter: 0,
      product: { productName: "Sprite 500ml", imageUrl: "" },
    },
    {
      id: "3",
      quantity: 10,
      price: 15000,
      stockBefore: 50,
      stockAfter: 40,
      product: { productName: "Aqua 600ml", imageUrl: "" },
    },
  ]

  const dummyMeta = {
    page: 1,
    limit: 10,
    total: 3,
    total_page: 1,
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
          items={dummyItems}
          meta={dummyMeta}
          isLoading={false}
          onPageChange={(page) => console.log("page:", page)}
        />
      </div>
    </div>
  )
}