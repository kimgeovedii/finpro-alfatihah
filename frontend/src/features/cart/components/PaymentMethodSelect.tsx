import React from "react"
import { CheckIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

type PaymentMethodType = "MANUAL" | "GATEWAY"

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
                    (() => {
                        const isSelected = selectedMethod === "MANUAL"

                        return (
                            <Button onClick={() => onSelectMethod("MANUAL")} className={`bg-transparent h-auto relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                                ${ isSelected ? "border-emerald-700 bg-white shadow-sm" : "border-slate-200 bg-slate-100 hover:border-slate-300"}`}>
                                { isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center"><CheckIcon className="w-3 h-3 text-white"/></div> }
                                <div className={`${isSelected ? "text-emerald-700" : "text-slate-400"}`}>
                                    <WalletIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <p className={`font-bold text-sm mb-0 ${isSelected ? "text-slate-800" : "text-slate-500"}`}>Manual</p>
                                    <p className={`text-xs ${isSelected ? "text-slate-500" : "text-slate-400"}`}>QRIS/Transfer</p>
                                </div>
                            </Button>
                        )
                    })()
                }
                {
                    (() => {
                        const isSelected = selectedMethod === "GATEWAY"

                        return (
                            <Button onClick={() => onSelectMethod("GATEWAY")} className={`bg-transparent h-auto relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                                ${ isSelected ? "border-emerald-700 bg-white shadow-sm" : "border-slate-200 bg-slate-100 hover:border-slate-300"}`}>
                                { isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center"><CheckIcon className="w-3 h-3 text-white"/></div> }
                                <div className={`${isSelected ? "text-emerald-700" : "text-slate-400"}`}>
                                    <CreditCardIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <p className={`font-bold text-sm mb-0 ${isSelected ? "text-slate-800" : "text-slate-500"}`}>Gateway</p>
                                    <p className={`text-xs ${isSelected ? "text-slate-500" : "text-slate-400"}`}>OVO/Dana/Gopay</p>
                                </div>
                            </Button>
                        )
                    })()
                }
            </div>
        </div>
    )
}