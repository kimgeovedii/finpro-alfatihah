import { StatsTitleValueText } from "@/components/layout/StatsTitleValueText"

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
            <div className="sm:col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
                <StatsTitleValueText title="Total Revenue Today" val={<>Rp {totalRevenue.toLocaleString("id-ID")}</>}/>
                {
                    revenueChangePercent !== 0 && 
                        <div className="flex items-center gap-1 mt-2 text-teal-600 text-sm font-medium">
                            <span>+{revenueChangePercent.toFixed(1)}% vs yesterday</span>
                        </div>
                }
            </div>
            <div className="bg-yellow-500 rounded-2xl p-6 flex flex-col justify-between text-white min-h-[140px]">
                <StatsTitleValueText title="Active Shipments" val={activeShipments} colorClass={"text-white"}/>
                <p className="text-white text-sm mt-2 font-medium line-clamp-3">
                    About {processingOrder} of your active order still being processing in the store.
                </p>
            </div>
            <div className="bg-teal-700 rounded-2xl p-6 flex flex-col justify-between text-white min-h-[140px]">
                <StatsTitleValueText title="Completed Order" val={finishedOrder} colorClass={"text-white"}/>
                <p className="text-teal-200 text-sm mt-2 font-medium line-clamp-3">
                    More than {finishedOrderLastMonth} of your orders are completed last 30 days.
                </p>
            </div>
        </div>
    )
}
  