import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToOrderSchema } from "../validation/order.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { OrderService } from "../services/order.service"

export class OrderController {
    private orderService = new OrderService()

    postAddCheckoutOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            
            // Validation
            const payload = AddToOrderSchema.parse(req.body)

            // Service
            const data = await this.orderService.addCartToOrder(userId, payload)

            return sendSuccess(res, data, "Order checkout!")
        } catch (error: any) {
            next(error)
        }
    }
}