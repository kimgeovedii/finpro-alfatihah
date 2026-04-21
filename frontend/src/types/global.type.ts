export type PaginationMeta = {
    page: number
    limit: number
    total: number
    total_page: number
}

export type StatusInfo = {
    key: string 
    label: string 
    sub: string 
    icon: any
    isLast?: boolean
}