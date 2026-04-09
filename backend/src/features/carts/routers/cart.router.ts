import { Router } from "express"
import { CartController } from "../controllers/cart.controller"

class CartRouter {
    public router: Router
    private cartController: CartController

    constructor() {
        this.router = Router()
        this.cartController = new CartController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post("/add-to-cart", this.cartController.postAddBranchInventoryToCart)
    }
}

export default new CartRouter().router