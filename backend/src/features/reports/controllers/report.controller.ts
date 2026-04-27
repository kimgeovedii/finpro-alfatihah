import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  public getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

      const data = await this.reportService.getSalesReport(month, year);
      return sendSuccess(res, data, "Sales report fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  public getStockReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

      const data = await this.reportService.getStockReport(month, year);
      return sendSuccess(res, data, "Stock report fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  public getDetailedStockReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

      const data = await this.reportService.getDetailedStockReport(productId as string, month, year);
      return sendSuccess(res, data, "Detailed stock report fetched successfully");
    } catch (error) {
      next(error);
    }
  };
}
