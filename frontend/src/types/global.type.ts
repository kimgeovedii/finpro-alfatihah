export type PaginationMeta = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type StatusInfo = {
    key: string 
    label: string 
    sub: string 
    icon: any
    isLast?: boolean
}

export type CommandResult = {
    success: boolean
    message: string
}