import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { OrderWebhookService } from "../services/order_webhook.service"

export class OrderWebhookController {
    private orderWebhookService = new OrderWebhookService()

    postMidtransWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.orderWebhookService.handleMidtransWebhook(req.body)
            return sendSuccess(res, null, "Webhook processed")
        } catch (error) {
            next(error)
        }
    }
}