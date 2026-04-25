import { NextFunction, Request, Response } from "express";
import { ProductDiscountService } from "../services/productDiscount.service";
import { sendSuccess } from "../../../utils/apiResponse";

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
      sendSuccess(res, data, "Products assigned to discount successfully");
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
      sendSuccess(res, data, "Product removed from discount successfully");
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
      sendSuccess(res, data, "Get discount products successfully");
    } catch (error) {
      next(error);
    }
  };
}
