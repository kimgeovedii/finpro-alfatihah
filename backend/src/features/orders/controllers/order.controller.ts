import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToOrderSchema } from "../validation/order.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { OrderService } from "../services/order.service"
import { paginationDefault, uuidRegex } from "../../../constants/feature.const"
import { orderCode } from "../../../constants/business.const"

export class OrderController {
    private orderService = new OrderService()

    getTransactionSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            
            // Service
            const result = await this.orderService.getOrderSummary(userId)

            return sendSuccess(res, result, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getTransactionSummaryByBranchId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            const branchId = req.params?.branchId as string

            // Validate the UUID format
            if (!uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
            
            // Service
            const result = await this.orderService.getOrderSummaryByBranchId(userId, branchId)

            return sendSuccess(res, result, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getAllTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Query param
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || paginationDefault
            const branchId = typeof req.query.branchId === 'string' ? req.query.branchId.trim() : null

            // Validate the UUID format
            if (branchId && !uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }
            
            // Service
            const result = await this.orderService.getAllOrders(page, limit, userId, branchId)

            return sendSuccess(res, {
                data: result.data,
                meta: {
                    page, limit, total: result.total, total_page: Math.ceil(result.total / limit),
                },
            }, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getOrderDetailByOrderNumber = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 

            // Route param
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }    

            // Service
            const result = await this.orderService.getOrderDetailByOrderNumber(userId, orderNumber)

            return sendSuccess(res, result, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

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

    deleteOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId

            // Route param
            const orderId = req.params.orderId as string
    
            // Service
            await this.orderService.deleteOrderById(userId, orderId)

            return sendSuccess(res, "Order deleted!")
        } catch (error: any) {
            next(error)
        }
    }
}