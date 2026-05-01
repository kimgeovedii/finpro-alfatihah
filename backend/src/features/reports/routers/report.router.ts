import { Router } from "express";
import { ReportController } from "../controllers/report.controller";

export class ReportRouter {
  public router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/sales", this.reportController.getSalesReport);
    this.router.get("/stocks", this.reportController.getStockReport);
    this.router.get("/stocks/:productId", this.reportController.getDetailedStockReport);
  }

}

export default new ReportRouter().router;
