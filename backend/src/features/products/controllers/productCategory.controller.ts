import { NextFunction, Request, Response } from "express";
import { ProductCategoryService } from "../services/productCategory.service";
import { sendSuccess } from "../../../utils/apiResponse";

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
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
        ...filters
      } = req.query;
      const { data, meta } =
        await this.productCategoryService.findAllCategories(
          filters,
          Number(page),
          Number(limit),
          sortBy as string,
          sortOrder as "asc" | "desc",
        );

      sendSuccess(res, { data, meta }, "Get all categories successfully");
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
      sendSuccess(res, data, "Create category successfully");
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
      sendSuccess(res, data, "Update category successfully");
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
      sendSuccess(res, data, "Delete category successfully");
    } catch (error) {
      next(error);
    }
  };
}
