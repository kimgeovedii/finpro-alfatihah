import { NextFunction, Request, Response } from "express";
import { ProductCategoriesServices } from "../services/productCategories.service";

export class ProductCategoriesController {
  private productCategoriesService: ProductCategoriesServices;

  constructor() {
    this.productCategoriesService = new ProductCategoriesServices();
  }

  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } = await this.productCategoriesService.findAll(
        filters,
        Number(page),
        Number(limit),
      );

      res.status(200).send({ data, meta });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.productCategoriesService.create(req.body);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.productCategoriesService.update(
        req.params.id as string,
        req.body,
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.productCategoriesService.delete(
        req.params.id as string,
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
}
