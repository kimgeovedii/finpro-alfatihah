import React from "react"
import { CreditCardIcon, QuestionMarkCircleIcon, WalletIcon } from "@heroicons/react/24/outline"
import { PaymentMethodType } from "@/types/global.type"
import { PaymentMethodItemCard } from "./PaymentMethodItemCard"
import { DividerLine } from "@/components/layout/DividerLine"
import { Button } from "@/components/ui/button"
import { HeadingText } from "@/components/layout/HeadingText"

interface Props {
    selectedMethod: PaymentMethodType
    
    onSelectMethod: (method: PaymentMethodType) => void
}

export const PaymentMethodSelect: React.FC<Props> = ({ selectedMethod, onSelectMethod }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <div className="flex justify-between items-center">
                <HeadingText children="Payment Method" level={2}/>
                <Button className="text-emerald-700 bg-transparent text-sm font-bold hover:text-emerald-600 transition-colors"><QuestionMarkCircleIcon/> Help Me</Button>
            </div>
            <DividerLine/>
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