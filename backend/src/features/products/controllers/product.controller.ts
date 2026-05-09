import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { sendSuccess } from "../../../utils/apiResponse";
import { AuthRequest } from "../../../middleware/auth.middleware";

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
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.userId 
      const slugName = req.params.slugName as string
      const storeName = decodeURIComponent(req.params.storeName as string)

      const data = await this.productService.getProductBySlug(slugName, userId, storeName);
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
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files as { [fieldname: string]: Express.Multer.File[] } | undefined)?.images;
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
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files as { [fieldname: string]: Express.Multer.File[] } | undefined)?.images;
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
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new Error("User unauthorized");

      const data = await this.productService.deleteProduct(
        req.params.id as string,
        authReq.user,
      );
      sendSuccess(res, data, "Delete product successfully");
    } catch (error) {
      next(error);
    }
  };
}
