import { Button } from "@/components/ui/button"
import { CheckIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    orderNumber: string
    onConfirm: (orderNumber: string) => void
}

export const OrderConfirmButton: React.FC<Props> = ({ orderNumber, onConfirm }) => {
    return (
        <div className="bg-green-100 p-2 rounded-lg w-full">
            <div className="flex justify-between w-full items-center">
                <div>
                    <p className="text-gray-700 font-normal text-sm mb-0">Your order is already arrive?</p>
                    <p className="text-gray-700 font-bold text-sm">Confirm your order now, and keep continue your shopping</p>
                </div>
                <Button className="bg-green-600" onClick={(e) => onConfirm(orderNumber)}>
                    <CheckIcon/> Confirm Now!
                </Button>
            </div>
        </div>
    )
}