import { PaginationMeta } from "@/types/global.type"

export type BranchData = {
    id: string
    city: string
    storeName: string
}

export type BranchResponse = {
    data: BranchData[]
    meta: PaginationMeta
}
