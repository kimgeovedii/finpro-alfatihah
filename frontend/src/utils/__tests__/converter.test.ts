import { formatDate, formatListSchedule } from "../converter.util"

describe("formatDate", () => {
    it("Should return formatted date without time", () => {
        // Test Data
        const iso = "2026-04-30T12:34:00Z"
    
        // Exec Util
        const result = formatDate(iso)
    
        // Test Criteria
        expect(typeof result).toBe("string")
        expect(result).toBe("30 Apr 2026")
    })
  
    it("Should return formatted date with time", () => {
        // Test Data
        const iso = "2026-04-30T12:34:00Z"
    
        // Exec Util
        const result = formatDate(iso, true)
    
        // Test Criteria
        expect(typeof result).toBe("string")
        expect(result).toMatch(/^30 Apr 2026 \d{2}:\d{2}$/)
    })
})
  
describe("formatListSchedule", () => {
    it("Should format single schedule correctly", () => {
        // Test Data
        const schedules = [
            { dayName: "MON", startTime: "08:00", endTime: "17:00" },
        ] as any
    
        // Exec Util
        const result = formatListSchedule(schedules)
    
        // Test Criteria
        expect(result).toBe("MON (08:00 - 17:00)")
    })

    it("Should return formatted schedule string sorted by day order", () => {
        // Test Data
        const schedules = [
            { dayName: "WED", startTime: "10:00", endTime: "20:00" },
            { dayName: "MON", startTime: "09:00", endTime: "18:00" },
            { dayName: "FRI", startTime: "11:00", endTime: "21:00" },
        ] as any
    
        // Exec Util
        const result = formatListSchedule(schedules)
    
        // Test Criteria
        expect(typeof result).toBe("string")
        expect(result).toBe(
            "MON (09:00 - 18:00), WED (10:00 - 20:00), FRI (11:00 - 21:00)"
        )
    })
  
    it("Should return '-' if schedules empty", () => {
        // Test Data
        const schedules: any[] = []
    
        // Exec Util
        const result = formatListSchedule(schedules)
    
        // Test Criteria
        expect(typeof result).toBe("string")
        expect(result).toBe("-") 
    })
})