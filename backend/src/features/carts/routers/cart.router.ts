import { Router } from "express"
import { CartController } from "../controllers/cart.controller"
import { authMiddleware } from "../../../middleware/auth.middleware"

class CartRouter {
    public router: Router
    private cartController: CartController

    constructor() {
        this.router = Router()
        this.cartController = new CartController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post("/add-to-cart", authMiddleware, this.cartController.postAddBranchInventoryToCart)
    }
}

export default new CartRouter().router