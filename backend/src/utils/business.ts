interface Schedule {
    startTime: string
    endTime: string
    dayName: "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT"
}

export const getStoreOpenStatus = (schedules: Schedule[]): string => {
    const now = new Date()
    const daysMap: Record<Schedule["dayName"], number> = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 }

    const currentDay = now.getDay()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const sch of schedules) {
        if (daysMap[sch.dayName] !== currentDay) continue

        const [startH, startM] = sch.startTime.split(':').map(Number)
        const [endH, endM] = sch.endTime.split(':').map(Number)
        const startMinutes = startH * 60 + startM
        const endMinutes = endH * 60 + endM

        // 1 hour before open
        if (currentMinutes >= startMinutes - 60 && currentMinutes < startMinutes) return `Opening soon at ${sch.startTime}`
        // In hours
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes - 60) return `Open`
        // 1 hour before close
        if (currentMinutes >= endMinutes - 60 && currentMinutes < endMinutes) return `Closing soon at ${sch.endTime}`
        // After hour
        if (currentMinutes >= endMinutes) return `Closed`
    }

    return `Closed`
}