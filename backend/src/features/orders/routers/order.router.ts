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
        this.router.get("/transaction", this.orderController.getAllTransaction)
        this.router.get("/summary", this.orderController.getTransactionSummary)
        this.router.post("/checkout", this.orderController.postAddCheckoutOrder)
        this.router.delete("/:orderId", this.orderController.deleteOrderById)
    }
}

export default new OrderRouter().router