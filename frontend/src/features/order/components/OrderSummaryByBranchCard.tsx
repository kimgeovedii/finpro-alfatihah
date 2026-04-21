
type Props = {
    totalRevenue: number
    revenueChangePercent: number
    activeShipments: number
    processingOrder: number
    finishedOrder: number
    finishedOrderLastMonth: number
}
  
export const OrderSummaryByBranchCard: React.FC<Props> = ({ totalRevenue, revenueChangePercent, activeShipments, processingOrder, finishedOrder, finishedOrderLastMonth }) => {
    return (
        <div className="flex gap-4 w-full mb-4">
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
                <p className="text-slate-500 text-sm font-medium">Total Revenue Today</p>
                <div>
                    <p className="text-4xl font-bold text-slate-800 mt-1">Rp {totalRevenue.toLocaleString("id-ID")}</p>
                    {
                        revenueChangePercent !== 0 && 
                            <div className="flex items-center gap-1 mt-2 text-teal-600 text-sm font-medium">
                                <span>+{revenueChangePercent.toFixed(1)}% vs yesterday</span>
                            </div>
                    }
                </div>
            </div>
            <div className="w-72 bg-yellow-500 rounded-2xl p-6 flex flex-col justify-between text-white min-h-[140px]">
                <p className="text-white text-sm font-semibold">Active Shipments</p>
                <div>
                    <p className="text-5xl font-bold mt-1">{activeShipments}</p>
                    <p className="text-white text-sm mt-2 font-medium">About {processingOrder} of your active order still being processing in the store.</p>
                </div>
            </div>
            <div className="w-72 bg-teal-700 rounded-2xl p-6 flex flex-col justify-between text-white min-h-[140px]">
                <p className="text-teal-100 text-sm font-semibold">Completed Order</p>
                <div>
                    <p className="text-5xl font-bold mt-1">{finishedOrder}</p>
                    <p className="text-teal-200 text-sm mt-2 font-medium">More than {finishedOrderLastMonth} of your orders are completed last 30 days.</p>
                </div>
            </div>
        </div>
    )
}
  