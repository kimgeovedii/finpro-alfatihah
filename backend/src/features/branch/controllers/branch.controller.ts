import { NextFunction, Request, Response } from "express";
import { BranchService } from "../services/branch.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class BranchController {
  private branchService: BranchService;

  constructor() {
    this.branchService = new BranchService();
  }

  public getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const branches = await this.branchService.getAllBranches();
      return sendSuccess(res, branches, "Get all branches successfully");
    } catch (error) {
      next(error);
    }
  };

  public getNearestBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lat, lng, page, limit } = req.query as any;
      const data = await this.branchService.findNearestBranch(
        lat,
        lng,
        page,
        limit
      );
      return sendSuccess(res, data, "Get nearest branch successfully");
    } catch (error) {
      next(error);
    }
  };
}
