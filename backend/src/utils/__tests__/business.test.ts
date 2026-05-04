import { getStoreOpenStatus } from "../business"

describe("getStoreOpenStatus", () => {
    // Mock system time (for new Date)
    beforeAll(() => {
        jest.useFakeTimers()
    })
    afterAll(() => {
        jest.useRealTimers()
    })

    const schedules = [
        {
            dayName: "THU" as const,
            startTime: "10:00",
            endTime: "20:00",
        },
    ]

    it("Should return Opening soon (within 1 hour before open)", () => {
        // Mock
        jest.setSystemTime(new Date("2026-04-30T09:30:00")) // Thursday

        // Exec Util
        const result = getStoreOpenStatus(schedules)

        // Test Criteria
        expect(typeof result).toBe('string')
        expect(result).toBe("Opening soon at 10:00")
    })

    it("Should return Open during business hours", () => {
        // Mock
        jest.setSystemTime(new Date("2026-04-30T12:00:00"))

        // Exec Util
        const result = getStoreOpenStatus(schedules)

        // Test Criteria
        expect(typeof result).toBe('string')
        expect(result).toBe("Open")
    })

    it("Should return Closing soon (within 1 hour before close)", () => {
        // Mock
        jest.setSystemTime(new Date("2026-04-30T19:30:00"))

        // Exec Util
        const result = getStoreOpenStatus(schedules)

        // Test Criteria
        expect(typeof result).toBe('string')
        expect(result).toBe("Closing soon at 20:00")
    })

    it("Should return Closed after hours", () => {
        // Mock
        jest.setSystemTime(new Date("2026-04-30T21:00:00"))

        // Exec Util
        const result = getStoreOpenStatus(schedules)

        // Test Criteria
        expect(typeof result).toBe('string')
        expect(result).toBe("Closed")
    })

    it("Should return Closed if no schedule for today", () => {
        // Mock
        jest.setSystemTime(new Date("2026-04-30T12:00:00"))

        // Exec Util
        const result = getStoreOpenStatus([
            {
                dayName: "FRI",
                startTime: "10:00",
                endTime: "20:00",
            },
        ])

        // Test Criteria
        expect(typeof result).toBe('string')
        expect(result).toBe("Closed")
    })
})