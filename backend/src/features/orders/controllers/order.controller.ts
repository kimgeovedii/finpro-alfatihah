import { NextFunction, Response } from "express"
import { sendSuccess } from "../../../utils/apiResponse"
import { AddToOrderSchema } from "../validation/order.dto"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { OrderService } from "../services/order.service"
import { paginationDefault, uuidRegex } from "../../../constants/feature.const"
import { orderCode } from "../../../constants/business.const"
import { OrderStatus } from "@prisma/client"

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
            const orderNumber = typeof req.query.orderNumber === 'string' ? req.query.orderNumber.trim() : null
            const dateStart = typeof req.query.dateStart === 'string' ? req.query.dateStart.trim() : null
            const dateEnd = typeof req.query.dateEnd === 'string' ? req.query.dateEnd.trim() : null

            // Validate the UUID format
            if (branchId && !uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }

            // Validate date pair (must come together)
            if ((dateStart && !dateEnd) || (!dateStart && dateEnd)) throw { code: 400, message: 'dateStart and dateEnd must be provided together' }
            
            // Service
            const result = await this.orderService.getAllOrders(page, limit, userId, branchId, orderNumber, dateStart, dateEnd)

            return sendSuccess(res, {
                data: result.data,
                meta: {
                    page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
                },
            }, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getAllTransactionManagementByBranchId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // Route param
            const branchId = req.params.branchId as string

            // Query param
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || paginationDefault
            const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : null

            // Validate the UUID format
            if (!uuidRegex.test(branchId)) throw { code: 400, message: 'branchId is not valid UUID' }

            // Validate status 
            let status: OrderStatus | null = null
            if (rawStatus && rawStatus !== "ALL") {
                if (!Object.values(OrderStatus).includes(rawStatus as OrderStatus)) throw { code: 400, message: 'status is not valid' }
                status = rawStatus as OrderStatus
            }

            // Service
            const result = await this.orderService.getAllOrderByBranchId(page, limit, branchId, status)

            return sendSuccess(res, {
                data: result.data,
                meta: {
                    page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
                },
            }, "Order fetched")
        } catch (error: any) {
            next(error)
        }
    }

    getOrderDetailByOrderNumber = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId 
            const role = req.user?.role

            // Route param
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }    

            // Service
            const result = await this.orderService.getOrderDetailByOrderNumber(role, userId, orderNumber)

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

    postAddShipping = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // Route param
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }

            // Service
            const data = await this.orderService.addShipping(orderNumber)

            return sendSuccess(res, data, "Order is on the way!")
        } catch (error: any) {
            next(error)
        }
    }

    postCancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            const role = req.user?.role

            // Route param
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }

            // Service
            const data = await this.orderService.addCancelOrder(userId, role, orderNumber)

            return sendSuccess(res, data, "Order is cancelled!")
        } catch (error: any) {
            next(error)
        }
    }

    postConfirmOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId

            // Route param
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }

            // Service
            const data = await this.orderService.addConfirmOrder(userId, orderNumber)

            return sendSuccess(res, data, "Order is confirmed!")
        } catch (error: any) {
            next(error)
        }
    }

    // Webhook
    postMidtransWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.orderService.handleMidtransWebhook(req.body)
            return sendSuccess(res, null, "Webhook processed")
        } catch (error) {
            next(error)
        }
    }
}