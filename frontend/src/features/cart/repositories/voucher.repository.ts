import { apiFetch } from "@/utils/api"
import { VoucherResponse } from "./voucher.type"

export const voucherRepository = {
    async getAllVouchers(page: number = 1, search: string = ""): Promise<VoucherResponse> {
        const query = new URLSearchParams({ page: String(page), ...(search && { search }), limit: "5" }).toString()
        return await apiFetch<VoucherResponse>(`/vouchers?${query}`, "get")
    },
}