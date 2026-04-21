export const dayOrderRule = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
export type OrderStatus = "WAITING_PAYMENT" | "WAITING_PAYMENT_CONFIRMATION" | "PROCESSING" | "SHIPPED" | "CONFIRMED" | "CANCELLED"
export const statusColorMap: Record<string, string> = {
    CANCELLED: "bg-red-400",
    WAITING_PAYMENT: "bg-orange-400",
    WAITING_PAYMENT_CONFIRMATION: "bg-orange-400",
    PROCESSING: "bg-blue-400",
    SHIPPED: "bg-purple-400",
    CONFIRMED: "bg-emerald-400",
}

// Multer & Cloudinary : File handling
export const allowedMimeTypesPaymentEvidence: string[] = ["image/jpeg", "image/png", "image/jpg"]
export const maxSizePaymentEvidence: number = 2 * 1024 * 1024 // 2 mb