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
        this.router.post("/checkout", authMiddleware, this.orderController.postAddCheckoutOrder)
    }
}

export default new OrderRouter().router