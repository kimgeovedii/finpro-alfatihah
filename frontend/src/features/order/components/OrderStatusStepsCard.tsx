import React from "react"
import { OrderConfirmButton } from "./OrderConfirmButton"

export type StatusInfo = {
    key: string 
    label: string 
    sub: string 
    icon: any
}

type Props = {
    statusSteps: StatusInfo[]
    currentStatus: string
    orderNumber: string
    status?: string
    onConfirm: (orderNumber: string) => void
}

export const OrderStatusStepsCard: React.FC<Props> = ({ statusSteps, currentStatus, onConfirm, orderNumber, status }) => {
    const getStepState = (stepKey: string, currentStatus: string): "done" | "active" | "upcoming" => {
        const currentIdx = statusSteps.findIndex(s => s.key === currentStatus)
        const stepIdx = statusSteps.findIndex(s => s.key === stepKey)
    
        if (stepIdx < currentIdx) return "done"
        if (stepIdx === currentIdx) return "active"
    
        return "upcoming"
    }

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-slate-800 font-bold mb-5">Order Progress</p>
            <div className="flex flex-col gap-0">
                {
                    statusSteps.map((dt, idx) => {
                        const state = getStepState(dt.key, currentStatus)
                        const isLast = idx === statusSteps.length - 1

                        return (
                            <div key={idx} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                                        ${state === "done" ? "bg-emerald-500 text-white" : ""}
                                        ${state === "active" ? "bg-emerald-600 text-white" : ""}
                                        ${state === "upcoming" ? "bg-slate-100 text-slate-400 border border-slate-200" : ""}
                                    `}>{dt.icon}</div>
                                    {
                                        !isLast && <div className={`w-0.5 flex-1 my-1 rounded-full min-h-[20px] ${state === "done" ? "bg-emerald-400" : "bg-slate-200"}`}/>
                                    }
                                </div>
                                <div className="pb-4">
                                    <p className={`text-sm font-semibold leading-tight
                                        ${state === "active" ? "text-emerald-600" : ""}
                                        ${state === "done" ? "text-slate-700" : ""}
                                        ${state === "upcoming" ? "text-slate-400" : ""}`}
                                    >{dt.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{dt.sub}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            { status === "SHIPPED" && <OrderConfirmButton orderNumber={orderNumber} onConfirm={onConfirm}/> }
        </div>
    )
}