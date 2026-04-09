import { NextFunction, Response } from "express"
import { CartService } from "../services/cart.service"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToCartSchema } from "../validation/cart.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"

export class CartController {
    private cartService = new CartService()

    postAddBranchInventoryToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            
            // Validation
            const payload = AddToCartSchema.parse(req.body)

            // Service
            const data = await this.cartService.addToCart(userId, payload)

            return sendSuccess(res, data, "Product added to cart!")
        } catch (error: any) {
            next(error)
        }
    }
}