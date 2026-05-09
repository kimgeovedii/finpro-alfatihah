import { getOrderStatusStyle, getPaymentStatusStyle } from "../generator.util"


describe("getOrderStatusStyle", () => {
    it("Should return orange style for waiting payment statuses", () => {
        // Test Data
        const waitingPayment = "WAITING_PAYMENT"
        const waitingConfirmation = "WAITING_PAYMENT_CONFIRMATION"

        // Exec Util
        const waitingPaymentResult = getOrderStatusStyle(waitingPayment)
        const waitingConfirmationResult = getOrderStatusStyle(waitingConfirmation)

        // Test Criteria
        expect(waitingPaymentResult).toBe("text-orange-600 bg-orange-100")
        expect(waitingConfirmationResult).toBe("text-orange-600 bg-orange-100")
    })

    it("Should return blue style for processing statuses", () => {
        // Test Data
        const processing = "PROCESSING"
        const shipped = "SHIPPED"

        // Exec Util
        const processingResult = getOrderStatusStyle(processing)
        const shippedResult = getOrderStatusStyle(shipped)

        // Test Criteria
        expect(processingResult).toBe("text-blue-600 bg-blue-100")
        expect(shippedResult).toBe("text-blue-600 bg-blue-100")
    })

    it("Should return emerald style for confirmed status", () => {
        // Test Data
        const status = "CONFIRMED"

        // Exec Util
        const result = getOrderStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-emerald-600 bg-emerald-100")
    })

    it("Should return red style for cancelled status", () => {
        // Test Data
        const status = "CANCELLED"

        // Exec Util
        const result = getOrderStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-red-600 bg-red-100")
    })

    it("Should return slate style for unknown status", () => {
        // Test Data
        const status = "UNKNOWN"

        // Exec Util
        const result = getOrderStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-slate-600 bg-slate-100")
    })
})

describe("getPaymentStatusStyle", () => {
    it("Should return orange style for pending status", () => {
        // Test Data
        const status = "PENDING"

        // Exec Util
        const result = getPaymentStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-orange-600 bg-orange-100")
    })

    it("Should return emerald style for success status", () => {
        // Test Data
        const status = "SUCCESS"

        // Exec Util
        const result = getPaymentStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-emerald-600 bg-emerald-100")
    })

    it("Should return red style for rejected status", () => {
        // Test Data
        const status = "REJECTED"

        // Exec Util
        const result = getPaymentStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-red-600 bg-red-100")
    })

    it("Should return slate style for unknown payment status", () => {
        // Test Data
        const status = "UNKNOWN"

        // Exec Util
        const result = getPaymentStatusStyle(status)

        // Test Criteria
        expect(result).toBe("text-slate-600 bg-slate-100")
    })
})