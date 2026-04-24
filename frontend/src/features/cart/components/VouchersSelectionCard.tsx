import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TicketIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

interface Voucher {
    code: string
    description: string
}

interface Props {
    vouchers: Voucher[]
    appliedVoucher?: string | null
    onApply: (code: string) => void
    onRemove?: (code: string) => void
}

export const VouchersSelectionCard: React.FC<Props> = ({ vouchers, appliedVoucher, onApply, onRemove }) => {
    const [search, setSearch] = useState("")

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">My Vouchers</h5>
            <Input placeholder="Search voucher..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 rounded-xl"/>
            <div className="flex flex-col gap-2">
                {
                    vouchers.map(dt => {
                        const isApplied = appliedVoucher === dt.code

                        return (
                            <div key={dt.code} className="bg-white rounded-2xl border border-dashed border-slate-200 p-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0"><TicketIcon className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-slate-800 font-bold text-sm mb-0">{dt.code}</p>
                                        <p className="text-slate-400 text-xs">{dt.description}</p>
                                    </div>
                                </div>
                                {
                                    isApplied ? 
                                        <Button onClick={() => onRemove?.(dt.code)} className="bg-red-100 text-red-500 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition-colors whitespace-nowrap">Remove</Button>
                                    :
                                        <Button onClick={() => onApply(dt.code)} className="bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap">Apply</Button>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}