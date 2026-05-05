import { getDistanceInKm, isWithinDeliveryRange } from "../location"

describe("getDistanceInKm", () => {
    it("Should return valid distance", () => {
        // Test Data
        const startLat = -6.228894242916274
        const startLong = 106.79977632896366
        const endLat = -6.219593323905387
        const endLong = 106.81221850753506

        // Exec Util
        const result = getDistanceInKm(startLat, startLong, endLat, endLong)
        
        // Test Criteria
        expect(typeof result).toBe('number')
        expect(result).toBeCloseTo(1.7, 1) // https://boulter.com/gps/distance return 1.7

        const resStr = result.toString()
        expect(resStr.includes('.')).toBe(true) // Make sure its decimal
    })

    it("Should return 0 if coordinate same", () => {
        // Mock
        const startLat = -6.228894242916274
        const startLong = 106.79977632896366

        // Exec Util
        const result = getDistanceInKm(startLat, startLong, startLat, startLong)
        
        // Test Criteria
        expect(typeof result).toBe('number')
        expect(result).toBe(0)
    })
})

describe("isWithinDeliveryRange", () => {
    it("Should return valid status true and valid distance", () => {
        // Test Data
        const startLat = -6.228894242916274
        const startLong = 106.79977632896366
        const endLat = -6.219593323905387
        const endLong = 106.81221850753506
        const maxDistance = 2 // km

        // Exec Util
        const result = isWithinDeliveryRange(startLat, startLong, endLat, endLong, maxDistance)
        
        // Test Criteria
        expect(typeof result.distance).toBe('number')
        expect(result.distance).toBeCloseTo(1.7, 1)
        const resStr = result.distance.toString()
        expect(resStr.includes('.')).toBe(true) // Make sure its decimal
        expect(typeof result.isInsideRange).toBe('boolean')
        expect(result.isInsideRange).toBe(true)
    })

    it("Should return valid status false and valid distance", () => {
        // Test Data
        const startLat = -6.228894242916274
        const startLong = 106.79977632896366
        const endLat = -6.219593323905387
        const endLong = 106.81221850753506
        const maxDistance = 1 // km

        // Exec Util
        const result = isWithinDeliveryRange(startLat, startLong, endLat, endLong, maxDistance)
        
        // Test Criteria
        expect(typeof result.distance).toBe('number')
        expect(result.distance).toBeCloseTo(1.7, 1)
        const resStr = result.distance.toString()
        expect(resStr.includes('.')).toBe(true) // Make sure its decimal
        expect(typeof result.isInsideRange).toBe('boolean')
        expect(result.isInsideRange).toBe(false)
    })
})