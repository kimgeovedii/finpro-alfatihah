import { NextFunction, Request, Response } from "express";
import { DiscountService } from "../services/discount.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountService();
  }

  public findAllDiscounts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } = await this.discountService.findAllDiscounts(
        filters,
        Number(page),
        Number(limit),
      );

      sendSuccess(res, { data, meta }, "Get all discounts successfully");
    } catch (error) {
      next(error);
    }
  };

  public createDiscount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.discountService.createDiscount(req.body);
      sendSuccess(res, data, "Create discount successfully");
    } catch (error) {
      next(error);
    }
  };

  public updateDiscount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.discountService.updateDiscount(
        req.params.id as string,
        req.body,
      );
      sendSuccess(res, data, "Update discount successfully");
    } catch (error) {
      next(error);
    }
  };

  public deleteDiscount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.discountService.deleteDiscount(
        req.params.id as string,
      );
      sendSuccess(res, data, "Delete discount successfully");
    } catch (error) {
      next(error);
    }
  };
}
