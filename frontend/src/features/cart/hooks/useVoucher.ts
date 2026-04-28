import { useState, useEffect } from "react"
import { PaginationMeta } from "@/types/global.type"
import { voucherRepository } from "../repositories/voucher.repository"
import { VoucherData } from "../repositories/voucher.type"

export const useAllVoucherData = () => {
    const [vouchers, setVouchers] = useState<VoucherData[]>([])
    const [meta, setMeta] = useState<PaginationMeta | null>(null)
    const [isLoadingVoucher, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllVouchers = async (page = 1, search = "") => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await voucherRepository.getAllVouchers(page, search)
            console.log(res)

            setVouchers((prev) => page === 1 ? res.data : [...prev, ...res.data])
            setMeta(res.meta)
        } catch (err: any) {
            setError(err.message || "Failed to fetch vouchers")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllVouchers(1)
    }, [])

    return { vouchers, meta, isLoadingVoucher, error, fetchAllVouchers }
}