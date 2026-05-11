import { NextFunction, Response } from "express"
import { CartService } from "../services/cart.service"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToCartSchema } from "../validation/cart.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { uuidRegex } from "../../../constants/feature.const"

export class CartController {
    private cartService = new CartService()

    getCartSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId

            // Query param
            const addressId = typeof req.query.addressId === 'string' ? req.query.addressId.trim() : null
            const coordinate = typeof req.query.coordinate === 'string' ? req.query.coordinate.trim() : null

            // Validate the UUID format
            if (addressId && !uuidRegex.test(addressId)) throw { code: 400, message: 'addressId is not valid UUID' }

            // Validate the coordinate
            if (coordinate) {
                const splitted = coordinate.split(',')
                if (splitted.length !== 2 || isNaN(Number(splitted[0])) || isNaN(Number(splitted[1]))) throw { code: 400, message: 'coordinate format must be lat,long' }
            }
    
            // Query param
            const branchId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null
    
            // Validate the UUID format
            if (branchId && !uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
    
            // Service
            const data = await this.cartService.getCartSummary(userId, branchId, addressId, coordinate)
    
            return sendSuccess(res, data, "Cart summary fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getAllCarts = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Query param
            const addressId = typeof req.query.addressId === 'string' ? req.query.addressId.trim() : null
            const coordinate = typeof req.query.coordinate === 'string' ? req.query.coordinate.trim() : null

            // Validate the UUID format
            if (addressId && !uuidRegex.test(addressId)) throw { code: 400, message: 'addressId is not valid UUID' }

            // Validate the coordinate
            if (coordinate) {
                const splitted = coordinate.split(',')
                if (splitted.length !== 2 || isNaN(Number(splitted[0])) || isNaN(Number(splitted[1]))) throw { code: 400, message: 'coordinate format must be lat,long' }
            }
            
            // Service
            const data = await this.cartService.getAllCarts(userId, addressId, coordinate)

            return sendSuccess(res, data, "Cart fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getCartDetailById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            const cartId = req.params?.cartId as string

            // Query param
            const addressId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null

            // Validate the UUID format
            if (!uuidRegex.test(cartId)) throw { code: 400, message: 'cartId is not valid UUID' }
            if (addressId && !uuidRegex.test(addressId)) throw { code: 400, message: 'addressId is not valid UUID' }
            
            // Service
            const result = await this.cartService.getCartDetailById(userId, cartId, addressId)

            return sendSuccess(res, result, "Cart fetched")
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

    deleteCartById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            const cartId = req.params?.cartId as string
    
            // Validate the UUID format
            if (!uuidRegex.test(cartId)) throw { code: 400, message: 'cartId is not valid UUID' }
    
            // Service
            const data = await this.cartService.deleteCartById(userId, cartId)
    
            return sendSuccess(res, data, "Cart deleted")
        } catch (error: any) {
            next(error)
        }
    }
}