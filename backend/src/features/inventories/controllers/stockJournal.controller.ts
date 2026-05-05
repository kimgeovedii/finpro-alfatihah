import { NextFunction, Request, Response } from "express";
import { StockJournalService } from "../services/stockJournal.service";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { sendSuccess } from "../../../utils/apiResponse";

export class StockJournalController {
  private stockJournalService: StockJournalService;

  constructor() {
    this.stockJournalService = new StockJournalService();
  }

  public findAllStockJournals = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        ...filters
      } = req.query;

      if (startDate && endDate) {
        filters.createdAt = {
          gte: new Date(startDate as string).toISOString(),
          lte: new Date(endDate as string).toISOString(),
        };
      }

      const { data, meta } =
        await this.stockJournalService.findAllStockJournals(
          filters,
          Number(page),
          Number(limit),
          authReq.user,
        );

      sendSuccess(res, { data, meta }, "Get all stock journals successfully");
    } catch (error) {
      next(error);
    }
  };

  public findStockJournalById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const data = await this.stockJournalService.findStockJournalById(
        req.params.id as string,
        authReq.user,
      );
      if (!data)
        return res.status(404).send({ message: "Stock journal not found" });

      sendSuccess(res, data, "Get stock journal successfully");
    } catch (error) {
      next(error);
    }
  };
}
