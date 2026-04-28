import React from "react"
import { CheckIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { PaymentMethodType } from "@/types/global.type"
import { PaymentMethodItemCard } from "./PaymentMethodItemCard"

interface Props {
    selectedMethod: PaymentMethodType
    
    onSelectMethod: (method: PaymentMethodType) => void
}

export const PaymentMethodSelect: React.FC<Props> = ({ selectedMethod, onSelectMethod }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">Payment Method</h5>
            <div className="grid grid-cols-2 gap-3">
                {
                    [
                        { value: "MANUAL", icon: <WalletIcon className="w-6 h-6"/>, title: "Manual", description: "QRIS/Transfer" },
                        { value: "GATEWAY", icon: <CreditCardIcon className="w-6 h-6"/>, title: "Gateway", description: "OVO/Dana/Gopay" }
                    ].map(m => (
                        <PaymentMethodItemCard key={m.value} value={m.value as PaymentMethodType} selected={selectedMethod} onSelect={onSelectMethod} icon={m.icon} title={m.title} description={m.description}/>
                    ))
                }
            </div>
        </div>
    )
}