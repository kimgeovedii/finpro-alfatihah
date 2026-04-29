import { StatsTitleValueText } from "@/components/layout/StatsTitleValueText"
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    totalPrice: number
    totalFinalPrice: number
    totalConfirmedOrder: number
    totalProcessingOrder: number
    totalWaitingOrder: number
    totalCancelledOrder: number
}

export const OrderSummaryCard: React.FC<Props> = ({ totalPrice, totalFinalPrice, totalConfirmedOrder, totalProcessingOrder, totalCancelledOrder, totalWaitingOrder}) => {
    const totalSaving: number = totalPrice - totalFinalPrice
    const savingPercentage: number = ((totalPrice - totalFinalPrice) / totalFinalPrice) * 100

    const summaryParts: React.ReactNode[] = []
    if (totalConfirmedOrder > 0) summaryParts.push(<><b>{totalConfirmedOrder}</b> confirmed order{totalConfirmedOrder > 1 ? "s" : ""}</>)
    if (totalProcessingOrder > 0) summaryParts.push(<><b>{totalProcessingOrder}</b> order{totalProcessingOrder > 1 ? "s" : ""} in progress</>)
    if (totalWaitingOrder > 0) summaryParts.push(<><b>{totalWaitingOrder}</b> awaiting payment</>)
    if (totalCancelledOrder > 0) summaryParts.push(<><b>{totalCancelledOrder}</b> cancelled</>)

    const summaryText = summaryParts.length === 0 ? <>So far you have no orders yet.</> : <>So far you have {
        summaryParts.map((dt, idx) => <React.Fragment key={idx}>{dt}{idx < summaryParts.length - 1 ? (idx === summaryParts.length - 2 ? " and " : ", ") : ""}</React.Fragment>)
        }.</>

    return (
        <>
            <p className="text-slate-500 mt-1 mb-4">{summaryText}</p>
            <div className="flex items-center gap-5 w-full">
                <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
                    <StatsTitleValueText title="Total Spending" val={<>Rp. {totalPrice.toLocaleString()}</>}/>
                </div>
                <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
                    <div className="flex gap-5">
                        <div>
                            <StatsTitleValueText title="Total Saving" val={<>Rp. {totalSaving.toLocaleString()}</>}/>
                        </div>
                        {
                            savingPercentage > 0 &&
                                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-3 rounded-lg">
                                    <ArrowTrendingUpIcon className="w-5 h-5 me-1"/> <span>+{savingPercentage.toFixed(2)}%</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}