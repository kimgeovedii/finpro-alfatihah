import { Router } from "express";
import { StockJournalController } from "../controllers/stockJournal.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

export class StockJournalRouter {
  private router: Router;
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
      this.stockJournalController.findAllStockJournals,
    );
    this.router.get(
      "/:id",
      authMiddleware,
      this.stockJournalController.findStockJournalById,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
