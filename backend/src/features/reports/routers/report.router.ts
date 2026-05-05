import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class ReportRouter {
  public router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.use(roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]));

    this.router.get("/sales", this.reportController.getSalesReport);
    this.router.get("/stocks", this.reportController.getStockReport);
    this.router.get("/stocks/:productId", this.reportController.getDetailedStockReport);
  }

}

export default new ReportRouter().router;
