import { Router } from "express"
import { OrderController } from "../controllers/order.controller"
import { authMiddleware } from "../../../middleware/auth.middleware"
import { OrderWebhookController } from "../controllers/order_webhook.controller"
import { OrderExportController } from "../controllers/order_export.controller"
import { EmployeeRole } from "@prisma/client"
import { roleMiddleware } from "../../../middleware/role.middleware"

class OrderRouter {
    public router: Router
    private orderController: OrderController
    private orderWebhookController: OrderWebhookController
    private orderExportController: OrderExportController

    constructor() {
        this.router = Router()
        this.orderController = new OrderController()
        this.orderWebhookController = new OrderWebhookController()
        this.orderExportController = new OrderExportController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        // Webhook
        this.router.post("/webhook/midtrans", this.orderWebhookController.postMidtransWebhook)

        this.router.use(authMiddleware)        

        const transactionRouter = Router()
        // Normal API
        transactionRouter.get("/", this.orderController.getAllTransaction)
        transactionRouter.get("/:orderNumber", this.orderController.getOrderDetailByOrderNumber)
        transactionRouter.get("/management/:branchId", roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]), this.orderController.getAllTransactionManagementByBranchId)
        // Export
        this.router.get("/export/invoice/:orderNumber", this.orderExportController.getInvoicePdf)
        this.router.get("/export/history", this.orderExportController.getTransactionHistoryExcel)
        this.router.use("/transaction", transactionRouter)

        const summaryRouter = Router()
        summaryRouter.get("/", this.orderController.getTransactionSummary)
        summaryRouter.get("/:branchId", roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]), this.orderController.getTransactionSummaryByBranchId)
        this.router.use("/summary", summaryRouter)

        this.router.post("/checkout", this.orderController.postAddCheckoutOrder)
        this.router.post("/shipping/:orderNumber", roleMiddleware([EmployeeRole.SUPER_ADMIN]), this.orderController.postAddShipping)
        this.router.post("/cancelling/:orderNumber", this.orderController.postCancelOrder)
        this.router.post("/confirming/:orderNumber", this.orderController.postConfirmOrder)        
    }
}

export default new OrderRouter().router