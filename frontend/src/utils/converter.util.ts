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

export const calculateDiscount = ( discountType: string, discountValueType: string, discountValue: number, quantity: number, basePrice: number, minPurchaseAmount?: number | null, maxDiscountAmount?: number | null) => {
    const totalPrice = basePrice * quantity

    // BOGO
    if (discountType === "BUY_ONE_GET_ONE_FREE") return 0

    // Product discount
    if (discountType === "PRODUCT_DISCOUNT") {
        if (discountValueType === "PERCENTAGE") {
            return Math.round((totalPrice * discountValue) / 100)
        }

        return discountValue * quantity
    }

    // Minimum purchase
    if (discountType === "MINIMUM_PURCHASE") {
        if (!minPurchaseAmount || totalPrice < minPurchaseAmount) return 0

        let discountAmount = 0

        if (discountValueType === "PERCENTAGE") {
            discountAmount = (totalPrice * discountValue) / 100
        } else {
            discountAmount = discountValue
        }

        if (maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, maxDiscountAmount)
        }

        return Math.round(discountAmount)
    }

    return 0
}