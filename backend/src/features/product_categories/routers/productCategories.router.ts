import { Router } from "express";
import { ProductCategoriesController } from "../controllers/productCategories.controller";
import { createProductCategoriesSchema } from "../validations/productCategories.schema";
import { validate } from "../../../middleware/validate";

export class ProductCategoriesRouter {
  private router: Router;
  private productCategoriesController: ProductCategoriesController;

  constructor() {
    this.router = Router();
    this.productCategoriesController = new ProductCategoriesController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.productCategoriesController.findAll);
    this.router.post(
      "/",
      validate(createProductCategoriesSchema),
      this.productCategoriesController.create,
    );
    this.router.put(
      "/:id",
      validate(createProductCategoriesSchema),
      this.productCategoriesController.update,
    );
    this.router.delete("/:id", this.productCategoriesController.delete);
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
