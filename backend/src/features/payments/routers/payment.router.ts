import { Router } from "express"
import { PaymentController } from "../controllers/payment.controller"
import { authMiddleware } from "../../../middleware/auth.middleware"
import { memoryUploader } from "../../../middleware/uploader.middleware"
import { roleMiddleware } from "../../../middleware/role.middleware"
import { EmployeeRole } from "@prisma/client"

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
        this.router.put("/manual/:paymentId", roleMiddleware([EmployeeRole.SUPER_ADMIN]), this.paymentController.putUpdatePaymentStatusById)
    }
}

export default new PaymentRouter().router