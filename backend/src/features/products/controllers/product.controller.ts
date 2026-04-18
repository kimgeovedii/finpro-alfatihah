import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";

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

      res
        .status(200)
        .send({ message: "Get all products successfully", data, meta });
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
      res.status(200).send({ message: "Get product successfully", data });
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
      res.status(200).send({ message: "Get product successfully", data });
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
      const data = await this.productService.createProduct(req.body);
      res.status(200).send({ message: "Create product successfully", data });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.updateProduct(
        req.params.id as string,
        req.body,
      );
      res.status(200).send({ message: "Update product successfully", data });
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
      res.status(200).send({ message: "Delete product successfully", data });
    } catch (error) {
      next(error);
    }
  };
}
