import { NextFunction, Request, Response } from "express";
import { BranchInventoryService } from "../services/branchInventory.service";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { sendSuccess } from "../../../utils/apiResponse";

export class BranchInventoryController {
  private branchInventoryService: BranchInventoryService;

  constructor() {
    this.branchInventoryService = new BranchInventoryService();
  }

  public findAllBranchInventories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } =
        await this.branchInventoryService.findAllBranchInventories(
          filters,
          Number(page),
          Number(limit),
        );

      sendSuccess(
        res,
        { data, meta },
        "Get all branch inventories successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  public createBranchInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      if (!userId) throw new Error("User unauthorized");

      const data = await this.branchInventoryService.createBranchInventory(
        req.body,
        userId,
      );
      sendSuccess(res, data, "Create branch inventory successfully");
    } catch (error) {
      next(error);
    }
  };

  public updateBranchInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      if (!userId) throw new Error("User unauthorized");

      const data = await this.branchInventoryService.updateBranchInventory(
        req.params.id as string,
        req.body,
        userId,
      );
      sendSuccess(res, data, "Update branch inventory successfully");
    } catch (error) {
      next(error);
    }
  };

  public deleteBranchInventory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      if (!userId) throw new Error("User unauthorized");

      const data = await this.branchInventoryService.deleteBranchInventory(
        req.params.id as string,
        userId,
      );
      sendSuccess(res, data, "Delete branch inventory successfully");
    } catch (error) {
      next(error);
    }
  };
}
