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
        this.router.use(authMiddleware)

        this.router.get("/branch/:branchId/product/:productId", this.cartItemController.getCartItemQtyByProductIdBranchId)
        this.router.put("/update-qty/:cartItemId", this.cartItemController.putUpdateCartItemQty)
        this.router.delete("/delete/:cartItemId", this.cartItemController.deleteCartItemById)
    }
}

export default new CartItemRouter().router