import { apiFetch } from "@/utils/api"
import { BranchResponse } from "./branch.type"

export const branchRepository = {
    async getAllBranches(page: number = 1): Promise<BranchResponse> {
        const params = new URLSearchParams({ page: String(page) })
        
        return await apiFetch<BranchResponse>(`/branches?${params.toString()}`,"get")
    }
}