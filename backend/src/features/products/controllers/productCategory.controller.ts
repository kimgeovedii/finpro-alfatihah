import { NextFunction, Request, Response } from "express";
import { ProductCategoryService } from "../services/productCategory.service";

export class ProductCategoryController {
  private productCategoryService: ProductCategoryService;

  constructor() {
    this.productCategoryService = new ProductCategoryService();
  }

  public findAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } =
        await this.productCategoryService.findAllCategories(
          filters,
          Number(page),
          Number(limit),
        );

      res
        .status(200)
        .send({ message: "Get all categories successfully", data, meta });
    } catch (error) {
      next(error);
    }
  };

  public addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productCategoryService.createCategory(req.body);
      res.status(200).send({ message: "Create category successfully", data });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productCategoryService.updateCategory(
        req.params.id as string,
        req.body,
      );
      res.status(200).send({ message: "Update category successfully", data });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productCategoryService.deleteCategory(
        req.params.id as string,
      );
      res.status(200).send({ message: "Delete category successfully", data });
    } catch (error) {
      next(error);
    }
  };
}
