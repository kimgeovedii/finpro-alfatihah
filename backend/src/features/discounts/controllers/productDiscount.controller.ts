import { NextFunction, Request, Response } from "express";
import { ProductDiscountService } from "../services/productDiscount.service";

export class ProductDiscountController {
  private productDiscountService: ProductDiscountService;

  constructor() {
    this.productDiscountService = new ProductDiscountService();
  }

  public assignProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const discountId = req.params.discountId as string;
      const { productIds } = req.body;
      const data = await this.productDiscountService.assignProducts(
        discountId,
        productIds,
      );
      res
        .status(200)
        .send({ message: "Products assigned to discount successfully", data });
    } catch (error) {
      next(error);
    }
  };

  public removeProductDiscount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const discountId = req.params.discountId as string;
      const productId = req.params.productId as string;
      const data = await this.productDiscountService.removeProductDiscount(
        discountId,
        productId,
      );
      res
        .status(200)
        .send({ message: "Product removed from discount successfully", data });
    } catch (error) {
      next(error);
    }
  };

  public getDiscountProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const discountId = req.params.discountId as string;
      const data =
        await this.productDiscountService.getProductsByDiscount(discountId);
      res
        .status(200)
        .send({ message: "Get discount products successfully", data });
    } catch (error) {
      next(error);
    }
  };
}
