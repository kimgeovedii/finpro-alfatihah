import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public findAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } = await this.productService.findAllProducts(
        filters,
        Number(page),
        Number(limit),
      );

      sendSuccess(res, { data, meta }, "Get all products successfully");
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.getProductById(
        req.params.id as string,
      );
      sendSuccess(res, data, "Get product successfully");
    } catch (error) {
      next(error);
    }
  };

  public getProductBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.getProductBySlug(
        req.params.slugName as string,
      );
      sendSuccess(res, data, "Get product successfully");
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const data = await this.productService.createProduct(req.body, files);
      sendSuccess(res, data, "Create product successfully");
    } catch (error: any) {
      next(error);
    }
  };

  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const data = await this.productService.updateProduct(
        req.params.id as string,
        req.body,
        files,
      );
      sendSuccess(res, data, "Update product successfully");
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.deleteProduct(
        req.params.id as string,
      );
      sendSuccess(res, data, "Delete product successfully");
    } catch (error) {
      next(error);
    }
  };
}
