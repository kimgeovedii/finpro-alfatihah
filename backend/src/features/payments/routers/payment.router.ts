import { Router } from "express"
import { PaymentController } from "../controllers/payment.controller"
import { authMiddleware } from "../../../middleware/auth.middleware"
import { memoryUploader } from "../../../middleware/uploader.middleware"

class PaymentRouter {
    public router: Router
    private paymentController: PaymentController

    constructor() {
        this.router = Router()
        this.paymentController = new PaymentController()

        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.use(authMiddleware)
        this.router.post("/manual/evidence/:orderId", memoryUploader().single("img"), this.paymentController.postAddEvidenceManualPayment)
    }
}

export default new PaymentRouter().router