import { NextFunction, Response } from "express"
import { AuthRequest } from "../../../middleware/auth.middleware"
import { OrderExportService } from "../services/order_export.service"
import { orderCode } from "../../../constants/business.const"

export class OrderExportController {
    private orderExportService = new OrderExportService()

    getInvoicePdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            const orderNumber = req.params.orderNumber as string

            // Validator order number
            if (!orderNumber.startsWith(`${orderCode}-`)) throw { code: 400, message: "Invalid order number format. Must start with 'ORD-'" }
    
            // Service : export order detail as pdf
            const pdfBuffer = await this.orderExportService.generateInvoicePdf(role, userId, orderNumber)
    
            // Return buffer
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", `inline; filename=invoice-${orderNumber}.pdf`)
    
            return res.send(pdfBuffer)
        } catch (error) {
            next(error)
        }
    }
}