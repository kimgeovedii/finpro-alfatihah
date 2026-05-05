import { Router } from "express";
import { StockJournalController } from "../controllers/stockJournal.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class StockJournalRouter {
  public router: Router;
  private stockJournalController: StockJournalController;

  constructor() {
    this.router = Router();
    this.stockJournalController = new StockJournalController();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      this.stockJournalController.findAllStockJournals,
    );
    this.router.get(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      this.stockJournalController.findStockJournalById,
    );
  }

}

export default new StockJournalRouter().router;
