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
        this.router.use(authMiddleware)

        this.router.get("/summary", this.cartController.getCartSummary)
        this.router.get("/", this.cartController.getAllCarts)
        this.router.get("/:cartId", this.cartController.getCartDetailById)
        this.router.post("/add-to-cart", this.cartController.postAddBranchInventoryToCart)
        this.router.delete("/delete/:cartId", this.cartController.deleteCartById)
    }
}

export default new CartRouter().router