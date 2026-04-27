import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TicketIcon, TruckIcon } from "@heroicons/react/24/outline"
import React, { useRef, useState } from "react"
import { useAllVoucherData } from "../hooks/useVoucher"

interface Props {
    appliedVoucher?: string | null
    onApply: (code: string) => void
    onRemove?: (code: string) => void
}

export const VouchersSelectionCard: React.FC<Props> = ({ appliedVoucher, onApply, onRemove }) => {
    const [search, setSearch] = useState("")
    const { vouchers, meta, isLoadingVoucher, fetchAllVouchers } = useAllVoucherData()

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const handleSearch = (value: string) => {
        setSearch(value)

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchAllVouchers(1, value)
        }, 750)
    }

    const handleSeeMore = () => {
        if (meta && meta.page < meta.totalPages) fetchAllVouchers(meta.page + 1, search)
    }

    const hasMore = meta ? meta.page < meta.totalPages : false

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">My Vouchers</h5>
            <Input placeholder="Search voucher..." value={search} onChange={(e) => handleSearch(e.target.value)} className="mb-4 rounded-xl"/>
            <div className="flex flex-col gap-2">
                {
                    isLoadingVoucher && vouchers.length === 0 ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse"/>
                        ))
                    ) : vouchers.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">No vouchers found</p>
                    ) : (
                        vouchers.map(dt => {
                            const isApplied = appliedVoucher === dt.voucherCode
                            const discountLabel = dt.discountValueType === "PERCENTAGE" ? `${dt.discountValue}% off` : `Rp ${dt.discountValue.toLocaleString()} off`

                            return (
                                <div key={dt.voucherCode} className="bg-white rounded-2xl border border-dashed border-slate-200 p-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            { dt.type === "ORDER" ? <TicketIcon className="w-5 h-5"/> : <TruckIcon className="w-5 h-5"/> }
                                            
                                        </div>
                                        <div>
                                            <p className="text-slate-800 font-bold text-sm mb-0">{dt.voucherCode}</p>
                                            <p className="text-slate-400 text-xs">{dt.name} · <b className="text-red-400">{discountLabel}</b></p>
                                        </div>
                                    </div>
                                    {
                                        isApplied ? 
                                            <Button onClick={() => onRemove?.(dt.voucherCode)} className="bg-red-100 text-red-500 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition-colors whitespace-nowrap">
                                                Remove
                                            </Button>
                                        : 
                                            <Button onClick={() => onApply(dt.voucherCode)} className="bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap">
                                                Apply
                                            </Button>
                                    }
                                </div>
                            )
                        })
                    )
                }
                {
                    hasMore && (
                        <Button onClick={handleSeeMore} disabled={isLoadingVoucher} className="mt-2 text-sm text-emerald-700 font-semibold bg-white border-1 border-emerald-700 text-center cursor-pointer">
                            {isLoadingVoucher ? "Loading..." : "See more"}
                        </Button>
                    )
                }
            </div>
        </div>
    )
}