import { dayOrderRule } from "@/constants/business.const"
import { Schedule } from "@/types/schedule.type"

export const formatDate = (isoString: string, withTime: boolean = false): string => {
    const date = new Date(isoString)
    const day = date.getDate()
    const month = date.toLocaleString("en-US", { month: "short" })
    const year = date.getFullYear()
  
    if (!withTime) return `${day} ${month} ${year}`
  
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
  
    return `${day} ${month} ${year} ${hours}:${minutes}`
}

export const formatListSchedule = (schedules: Schedule[]) => {
    return schedules.sort((a, b) => dayOrderRule.indexOf(a.dayName) - dayOrderRule.indexOf(b.dayName))
        .map(dt => `${dt.dayName} (${dt.startTime} - ${dt.endTime})`)
        .join(", ") ?? "-"
}