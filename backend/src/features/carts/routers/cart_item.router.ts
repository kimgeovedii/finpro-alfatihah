import { Router } from "express"
import { authMiddleware } from "../../../middleware/auth.middleware"
import { CartItemController } from "../controllers/cart_item.controller"

class CartItemRouter {
    public router: Router
    private cartItemController: CartItemController

    constructor() {
        this.router = Router()
        this.cartItemController = new CartItemController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.put("/update-qty/:cartItemId", authMiddleware, this.cartItemController.putUpdateCartItemQty)
    }
}

export default new CartItemRouter().router