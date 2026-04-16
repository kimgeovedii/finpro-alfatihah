// For dummy
export const shippingRatePerKM: number = 1000 
export const baseShippingCost: number = 5000   
export const paymentDeadline: number = 60 * 60 * 1000 // 1 hour
export const orderCode: string = 'ORD'

// Third service
// Raja Ongkir : Shippment
export const weightGramsShippingDefault: number = 1000 // 1 kg
export const courierShippingDefault: string = 'jne' 
// Multer & Cloudinary : File handling
export const maxSizePaymentEvidence: number = 2 * 1024 * 1024 // 2 mb
export const allowedMimeTypesPaymentEvidence: string[] = ["image/jpeg", "image/png", "image/jpg"]
export const allowedExtensionsPaymentEvidence = [".jpg", ".jpeg", ".png"]