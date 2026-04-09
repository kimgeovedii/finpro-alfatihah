import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { UpdateCartItemQtySchema } from "../validation/cart_item.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { CartItemService } from "../services/cart_item.service"

export class CartItemController {
    private cartItemService = new CartItemService()

    putUpdateCartItemQty = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Route param
            const cartItemId = req.params.cartItemId as string

            // Validation
            const payload = UpdateCartItemQtySchema.parse(req.body)

            // Service
            const data = await this.cartItemService.updateCartItemQty(userId, cartItemId, payload)

            return sendSuccess(res, data, "Product item updated!")
        } catch (error: any) {
            next(error)
        }
    }

    deleteCartItemById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Route param
            const cartItemId = req.params.cartItemId as string

            // Service
            await this.cartItemService.deleteCartItemById(userId, cartItemId)

            return sendSuccess(res, "Product item deleted!")
        } catch (error: any) {
            next(error)
        }
    }
}