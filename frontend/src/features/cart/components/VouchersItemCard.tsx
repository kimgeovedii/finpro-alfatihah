import { TicketIcon, TruckIcon } from "@heroicons/react/24/outline"
import { VoucherData } from "../repositories/voucher.type"
import { Button } from "@/components/ui/button"

interface Props {
    item: VoucherData
    isApplied: boolean
    totalBasePrice: number

    onApply: (voucher: VoucherData) => void
    onRemove?: () => void
}

export const VouchersItemCard: React.FC<Props> = ({ item, isApplied, totalBasePrice, onApply, onRemove }) => {
    const discountLabel = item.discountValueType === "PERCENTAGE" ? `${item.discountValue}% off` : `Rp ${item.discountValue.toLocaleString("id-ID")} off`
    const isMinPurchaseValid = item.minPurchaseAmount == null || totalBasePrice >= item.minPurchaseAmount
    const isExpired = item.expiredDate ? new Date() > new Date(item.expiredDate) : false
    const isQuotaEmpty = item.quota <= 0
    const isDisabled = !isMinPurchaseValid || isExpired || isQuotaEmpty

    let errorMessage = ""
    if (isExpired) errorMessage = "Voucher expired"
    else if (isQuotaEmpty) errorMessage = "Voucher quota exceeded"
    else if (!isMinPurchaseValid) errorMessage = `Min purchase Rp ${item.minPurchaseAmount?.toLocaleString("id-ID")}`

    return (
        <div className={`bg-white rounded-2xl border-3 border-dashed p-3 flex items-center justify-between gap-3 ${isDisabled ? "border-slate-100 opacity-60" : "border-slate-200"}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    { item.type === "ORDER" ? <TicketIcon className="w-5 h-5"/> : <TruckIcon className="w-5 h-5"/> }
                </div>
                <div>
                    <p className="text-slate-800 font-bold text-sm mb-0">{item.voucherCode}</p>
                    <p className="text-slate-400 text-xs">{item.name} · <b className="text-red-400">{discountLabel}</b></p>
                    <p className="text-xs text-orange-400">Max Discount Rp. {item.maxDiscountAmount.toLocaleString()}{ isDisabled && <span className="text-xs text-red-400 mt-1"> · {errorMessage}</span> }</p>
                </div>
            </div>
            {
                isApplied ? 
                    <Button onClick={() => onRemove?.()} className="bg-red-100 text-red-500 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition-colors whitespace-nowrap">Remove</Button>
                : 
                    <Button onClick={() => { if (isDisabled) return; onApply(item) }} disabled={isDisabled} className={`text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-emerald-800 text-white hover:bg-emerald-700"}`}>Apply</Button>
            }
        </div>
    )
}