import { randomCoordinateNear, randomEnumValue, randomSchedule } from "../generator"
import { getDistanceInKm } from "../location"

describe("randomEnumValue", () => {
    it("Should return one of the provided enum values", () => {
        // Test Data
        const values = ["A", "B", "C"] as const
    
        // Exec Util
        const result = randomEnumValue(values)
    
        // Test Criteria
        expect(values.includes(result)).toBe(true)
    })
  
    it("Should return varying values across multiple calls", () => {
        // Test Data
        const values = ["A", "B", "C"] as const
        const results = new Set<string>()
    
        // Exec Util
        for (let i = 0; i < 20; i++) {
            results.add(randomEnumValue(values))
        }
    
        // Test Criteria
        expect(results.size).toBeGreaterThan(1)
    })
})

describe("randomCoordinateNear", () => {
    it("Should return valid coordinate", () => {
        // Test Data
        const lat = -6.2
        const long = 106.8
        const maxKm = 5

        // Exec Util
        const result = randomCoordinateNear(lat, long)
    
        // Test Criteria
        expect(typeof result.lat).toBe("number")
        expect(typeof result.long).toBe("number")

        // Make sure decimal has max 6 digit 
        expect(result.lat.toString()).toMatch(/^\-?\d+(\.\d{1,6})?$/)
        expect(result.long.toString()).toMatch(/^\-?\d+(\.\d{1,6})?$/)

        // Coordinate must within max distance
        const distance = getDistanceInKm(lat, long, result.lat, result.long)
        expect(distance).toBeLessThanOrEqual(maxKm)
    })
  
    it("Should generate different coordinates across multiple calls", () => {
        // Test Data
        const lat = -6.2
        const long = 106.8
        const results = new Set<string>()
    
        // Exec Util
        for (let i = 0; i < 10; i++) {
            const coord = randomCoordinateNear(lat, long)
            results.add(`${coord.lat},${coord.long}`)
        }
    
        // Test Criteria
        expect(results.size).toBeGreaterThan(1)
    })
})

describe("randomSchedule", () => {
    it("Should return 6 active days and 1 day off with valid time", () => {
        // Exec Util
        const result = randomSchedule()
    
        // Test Data
        const allDays = ["MON","TUE","WED","THU","FRI","SAT","SUN"]
    
        // Test Criteria
        expect(result.activeDays.length).toBe(6)
    
        // Make sure day valid and have one day off
        const missingDays = allDays.filter(d => !result.activeDays.includes(d as any))
        expect(missingDays.length).toBe(1)

        // Validate time format
        expect(result.startTime).toMatch(/^\d{2}:00$/)
        expect(result.endTime).toMatch(/^\d{2}:00$/)

        // Validate hour start based on upper and bottom limit
        const hourStart = Number(result.startTime.split(":")[0])
        expect(hourStart).toBeGreaterThanOrEqual(6)
        expect(hourStart).toBeLessThanOrEqual(10)

        // Validate hour end based on upper and bottom limit
        const hourEnd = Number(result.endTime.split(":")[0])
        expect(hourEnd).toBeGreaterThanOrEqual(20)
        expect(hourEnd).toBeLessThanOrEqual(23)
    })
})