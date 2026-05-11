// For dummy
export const shippingRatePerKM: number = 1000 
export const baseShippingCost: number = 5000   
export const paymentDeadline: number = 60 * 60 * 1000 // 1 hour
export const orderAutoConfirmLimitHour: number = 60 * 60 * 1000 * 168 // 168 hours / 7 days
export const orderCode: string = 'ORD'

// Third service
// Raja Ongkir : Shipment
export const weightGramsShippingDefault: number = 1000 // 1 kg
export const courierShippingDefault: string = 'jne' 
export const isShipmentTesting: boolean = false
export const mockShipmentCity: string = "Jakarta"
export const mockShipmentPricePerKG: number = 18000
// Multer & Cloudinary : File handling
export const maxSizePaymentEvidence: number = 2 * 1024 * 1024 // 2 mb
export const allowedMimeTypesPaymentEvidence: string[] = ["image/jpeg", "image/png", "image/jpg"]
export const allowedExtensionsPaymentEvidence = [".jpg", ".jpeg", ".png"]

// Currency
export const currencyFormat: string = "id-ID"