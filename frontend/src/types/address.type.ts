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
    isPrimary: boolean
}

export type BranchData = {
    id: string
    storeName: string
    address: string
    city: string
    schedules: Schedule[]
}