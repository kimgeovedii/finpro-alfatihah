import { Schedule } from "./schedule.type"

export type AddressData = {
    id: string
    label: string
    lat: number
    long: number
    type: string
    receiptName: string
    notes: string
    phone: string   
    address: string
    distance?: number 
    isWithinRange?: boolean
    isPrimary: boolean
}

export type BranchData = {
    id?: string
    storeName: string
    address: string
    city?: string
    slug?: string
    schedules: Schedule[]
    openStatus?: string
}