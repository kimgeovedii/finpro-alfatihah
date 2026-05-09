import { Response, NextFunction } from "express";
import { ReportService } from "../services/report.service";
import { sendSuccess } from "../../../utils/apiResponse";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { EmployeeRole } from "@prisma/client";

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  private getBranchId(req: AuthRequest): string | undefined {
    const employee = req.user?.employee;
    const queryBranchId = req.query.branchId as string;

    if (employee?.role === EmployeeRole.STORE_ADMIN) {
      return employee.branchId as string;
    }

    if (employee?.role === EmployeeRole.SUPER_ADMIN) {
      return queryBranchId || undefined;
    }

    return undefined;
  }

  public getSalesReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      const branchId = this.getBranchId(req);

      const data = await this.reportService.getSalesReport(month, year, branchId);
      return sendSuccess(res, data, "Sales report fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  public getStockReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      const branchId = this.getBranchId(req);

      const data = await this.reportService.getStockReport(month, year, branchId);
      return sendSuccess(res, data, "Stock report fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  public getDetailedStockReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
      const branchId = this.getBranchId(req);

      const data = await this.reportService.getDetailedStockReport(productId as string, month, year, branchId);
      return sendSuccess(res, data, "Detailed stock report fetched successfully");
    } catch (error) {
      next(error);
    }
  };
}

