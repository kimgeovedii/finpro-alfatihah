import { NextFunction, Response } from "express"
import { CartService } from "../services/cart.service"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToCartSchema } from "../validation/cart.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { paginationDefault } from "../../../constants/features.const"

export class CartController {
    private cartService = new CartService()

    getAllCarts = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Query
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || paginationDefault
            const branchId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null
            
            // Service
            const result = await this.cartService.getAllCarts(page, limit, userId, branchId)

            return sendSuccess(res, {
                data: result.data,
                meta: {
                    page, limit, total: result.total, total_page: Math.ceil(result.total / limit),
                },
            }, "Cart fetched")
        } catch (error: any) {
            next(error)
        }
    }

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