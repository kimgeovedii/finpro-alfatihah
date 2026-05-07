import { Input } from "@/components/ui/input"
import React, { useCallback, useRef, useState } from "react"
import { useAllVoucherData } from "../hooks/useVoucher"
import { VoucherData } from "../repositories/voucher.type"
import { debouncerTimeLimit } from "@/constants/feature.const"
import { SkeletonBox } from "@/components/layout/SkeletonBox"
import { VouchersItemCard } from "./VouchersItemCard"
import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"

interface Props {
    appliedVoucher?: string | null
    totalBasePrice: number
    onApply: (voucher: VoucherData) => void
    onRemove?: () => void
}

export const VouchersSelectionCard: React.FC<Props> = ({ appliedVoucher, totalBasePrice, onApply, onRemove }) => {
    const [search, setSearch] = useState("")
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Handle hook (fetch)
    const { vouchers, meta, isLoadingVoucher, fetchAllVouchers } = useAllVoucherData()
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Handle hook (action)
    const handleSearch = (value: string) => {
        setSearch(value)

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchAllVouchers(1, value)
        }, debouncerTimeLimit)
    }

    const handleLoadMore = useCallback((node: HTMLDivElement | null) => {
        if (isLoadingVoucher) return
        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && meta && meta.page < meta.totalPages) fetchAllVouchers(meta.page + 1, search)
        })

        if (node) observerRef.current.observe(node)
    }, [isLoadingVoucher, meta, fetchAllVouchers, search])

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <HeadingText children="My Vouchers" level={2}/>
            <DividerLine/>
            <Input placeholder="Search voucher..." value={search} onChange={(e) => handleSearch(e.target.value)} className="mb-4 rounded-xl"/>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px]">
                {
                    isLoadingVoucher && vouchers.length === 0 ? 
                        Array.from({ length: 3 }).map((_, i) => <SkeletonBox key={i} extraClass={'min-h-[60px]'}/>)
                    : vouchers.length === 0 ? 
                        <p className="text-slate-400 text-sm text-center py-4">No vouchers found</p>
                    : 
                        vouchers.map((dt, i) => {
                            const isLast = i === vouchers.length - 1
                            const isApplied = appliedVoucher === dt.voucherCode
                        
                            return (
                                <div ref={isLast ? handleLoadMore : null} key={dt.voucherCode}>
                                    <VouchersItemCard
                                        item={dt}
                                        isApplied={isApplied}
                                        totalBasePrice={totalBasePrice}
                                        onApply={onApply}
                                        onRemove={onRemove}
                                    />
                                </div>
                            )
                        })
                }
                {
                    isLoadingVoucher && vouchers.length > 0 && 
                        <>
                            <SkeletonBox extraClass={'min-h-[60px]'}/>
                            <SkeletonBox extraClass={'min-h-[60px]'}/>
                            <SkeletonBox extraClass={'min-h-[60px]'}/>
                        </>
                }
            </div>
        </div>
    )
}