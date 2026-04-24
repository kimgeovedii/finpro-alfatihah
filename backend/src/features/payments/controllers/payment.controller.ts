import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { PaymentService } from "../services/payment.service"
import { cloudinaryUpload } from "../../../config/cloudinary"
import { ValidatePaymentEvidenceSchema } from "../validation/payment.dto"

export class PaymentController {
    private paymentService = new PaymentService()

    postAddEvidenceManualPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Route param
            const orderId = req.params.orderId as string

            // Image upload
            let filePath: string
            if (req.file) { 
                const result = await cloudinaryUpload(req.file) 
                filePath = result.secure_url 
            } else {
                throw { code: 400, message: 'Please select your payment evidence' }
            }

            // Service
            const data = await this.paymentService.addEvidenceManualPayment(userId, orderId, filePath)

            return sendSuccess(res, data, "Payment checkout!")
        } catch (error: any) {
            next(error)
        }
    }

    putUpdatePaymentStatusById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Validation
            const payload = ValidatePaymentEvidenceSchema.parse(req.body)

            // Route param
            const paymentId = req.params.paymentId as string

            // Service
            await this.paymentService.putUpdatePaymentStatusById(userId, paymentId, payload)

            return sendSuccess(res, "Payment confirmed!")
        } catch (error: any) {
            next(error)
        }
    }
}