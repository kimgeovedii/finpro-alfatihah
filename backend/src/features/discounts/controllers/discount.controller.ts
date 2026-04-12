import { NextFunction, Request, Response } from "express";
import { DiscountService } from "../services/discount.service";

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

      res
        .status(200)
        .send({ message: "Get all discounts successfully", data, meta });
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
      res.status(200).send({ message: "Create discount successfully", data });
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
      res.status(200).send({ message: "Update discount successfully", data });
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
      res.status(200).send({ message: "Delete discount successfully", data });
    } catch (error) {
      next(error);
    }
  };
}
