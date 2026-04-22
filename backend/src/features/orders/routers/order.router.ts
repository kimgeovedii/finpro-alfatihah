import { Router } from "express"
import { OrderController } from "../controllers/order.controller"
import { authMiddleware } from "../../../middleware/auth.middleware"

class OrderRouter {
    public router: Router
    private orderController: OrderController

    constructor() {
        this.router = Router()
        this.orderController = new OrderController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.use(authMiddleware)

        const transactionRouter = Router()
        transactionRouter.get("/", this.orderController.getAllTransaction)
        transactionRouter.get("/:orderNumber", this.orderController.getOrderDetailByOrderNumber)
        transactionRouter.get("/management/:branchId", this.orderController.getAllTransactionManagementByBranchId)
        this.router.use("/transaction", transactionRouter)

        const summaryRouter = Router()
        summaryRouter.get("/", this.orderController.getTransactionSummary)
        summaryRouter.get("/:branchId", this.orderController.getTransactionSummaryByBranchId)
        this.router.use("/summary", summaryRouter)

        this.router.post("/checkout", this.orderController.postAddCheckoutOrder)
        this.router.post("/shipping/:orderNumber", this.orderController.postAddShipping)
        this.router.post("/cancelling/:orderNumber", this.orderController.postCancelOrder)
        this.router.delete("/:orderId", this.orderController.deleteOrderById)
    }
}

export default new OrderRouter().router