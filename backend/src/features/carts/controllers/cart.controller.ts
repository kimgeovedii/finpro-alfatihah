import { NextFunction, Response } from "express"
import { CartService } from "../services/cart.service"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToCartSchema } from "../validation/cart.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { paginationDefault, uuidRegex } from "../../../constants/features.const"

export class CartController {
    private cartService = new CartService()

    getCartSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
    
            // Query param
            const branchId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null
    
            // Validate the UUID format
            if (branchId && !uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
    
            // Service
            const data = await this.cartService.getCartSummary(userId, branchId)
    
            return sendSuccess(res, data, "Cart summary fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getAllCarts = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Query param
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || paginationDefault
            const branchId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null

            // Validate the UUID format
            if (branchId && !uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
            
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