import { baseShippingCost, shippingRatePerKM } from "../constants/business.const"
import { earthRadiusKM } from "../constants/formula.const"

// Returns distance in KM between two coordinates (Haversine formula)
export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (val: number) => (val * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusKM * c
}

export const isWithinDeliveryRange = (userLat: number, userLon: number, branchLat: number, branchLon: number, maxDistanceKm: number): { isInsideRange: boolean; distance: number } => {
    const distance = getDistanceInKm(userLat, userLon, branchLat, branchLon)
    const isInsideRange = distance <= maxDistanceKm
    
    return { isInsideRange , distance }
}