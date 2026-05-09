import { DayName } from "@prisma/client";
import { earthRadiusKM } from "../constants/formula.const";

export const randomEnumValue = <T>(values: readonly T[]): T => values[Math.floor(Math.random() * values.length)]

// Get a random coordinate within maxKm radius from a given lat/long
export const randomCoordinateNear = (lat: number, long: number, maxKm: number = 5): { lat: number; long: number } => {
    const maxDelta = maxKm / earthRadiusKM

    // Random angle and distance within the circle 
    const u = Math.random()
    const v = Math.random()
    const w = maxDelta * Math.sqrt(u)
    const t = 2 * Math.PI * v

    // Convert polar offset to lat/long deltas in radians
    const deltaLat = w * Math.cos(t)
    const deltaLong = w * Math.sin(t) / Math.cos((lat * Math.PI) / 180)

    // Apply deltas and round to 6 digit coordinate
    return {
        lat: parseFloat((lat + (deltaLat * 180) / Math.PI).toFixed(6)),
        long: parseFloat((long + (deltaLong * 180) / Math.PI).toFixed(6)),
    }
}

// Get a 6-day schedule with random open hours and one random day off
export const randomSchedule = () => {
    const allDays: DayName[] = [DayName.MON, DayName.TUE, DayName.WED, DayName.THU, DayName.FRI, DayName.SAT, DayName.SUN]
    
    // Pick one random day off
    const dayOff = allDays[Math.floor(Math.random() * allDays.length)]
    const activeDays = allDays.filter((d) => d !== dayOff)

    // Random open hour (06-10) and close hour (20-23)  
    const startHour = Math.floor(Math.random() * 5) + 6  
    const endHour = Math.floor(Math.random() * 4) + 20  

    // Format hours as HH:mm
    const pad = (n: number) => String(n).padStart(2, '0')
    const startTime = `${pad(startHour)}:00`
    const endTime = `${pad(endHour)}:00`

    return { activeDays, startTime, endTime }
}