
import { Button } from "@/components/ui/button"
import React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

type Props = {
    orderNumber: string
    onCancel: (orderNumber: string) => void
}

export const OrderCancelButton: React.FC<Props> = ({ orderNumber, onCancel }) => {
    return (
        <Button className="w-full bg-red-100 text-red-500 border-1 border-red-500 hover:bg-red-500 hover:text-white cursor-pointer" onClick={(e) => onCancel(orderNumber)}>
            <XMarkIcon className="w-4 h-4"/> Cancel Order
        </Button>
    )
}