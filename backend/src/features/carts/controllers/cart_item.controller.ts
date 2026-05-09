import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { UpdateCartItemQtySchema } from "../validation/cart_item.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { CartItemService } from "../services/cart_item.service"
import { uuidRegex } from "../../../constants/feature.const"

export class CartItemController {
    private cartItemService = new CartItemService()

    getCartItemQtyByProductIdBranchId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            const branchId = req.params?.branchId as string
            const productId = req.params?.productId as string

            // Validate the UUID format
            if (!uuidRegex.test(productId)) throw { code: 400, message: 'productId is not valid UUID' }
            if (!uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
            
            // Service
            const result = await this.cartItemService.getCartItemQtyByProductIdBranchId(userId, productId, branchId)

            return sendSuccess(res, result, "Cart item fetched")
        } catch (error: any) {
            next(error)
        }
    }

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
            const data = await this.cartItemService.deleteCartItemById(userId, cartItemId)

            return sendSuccess(res, data, "Product item deleted!")
        } catch (error: any) {
            next(error)
        }
    }
}