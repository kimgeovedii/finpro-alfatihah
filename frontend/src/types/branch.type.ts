import { Schedule } from "./schedule.type"

// For handling branch info card
export type BranchInfoData = {
    storeName: string
    address: string
    schedule: Schedule[]
    imageUrl?: string
    openStatus: string
}