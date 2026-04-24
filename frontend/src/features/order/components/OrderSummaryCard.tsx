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
                    <h3 className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">Total Spending</h3>
                    <p className="text-3xl font-bold mt-2 text-slate-800">Rp. {totalPrice.toLocaleString()}</p>
                </div>
                <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
                    <div className="flex gap-5">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">Total Saving</h3>
                            <p className="text-3xl font-bold mt-2 text-slate-800">Rp. {totalSaving.toLocaleString()}</p>
                        </div>
                        {
                            savingPercentage > 0 &&
                                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                    </svg>
                                    <span>+{savingPercentage.toFixed(2)}%</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}