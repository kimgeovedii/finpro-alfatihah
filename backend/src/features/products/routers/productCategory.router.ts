import { Router } from "express";
import { ProductCategoryController } from "../controllers/productCategory.controller";
import { createProductCategoriesSchema } from "../validations/productCategory.schema";
import { validate } from "../../../middleware/validate";

export class ProductCategoryRouter {
  public router: Router;
  private productCategoriesController: ProductCategoryController;

  constructor() {
    this.router = Router();
    this.productCategoriesController = new ProductCategoryController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.productCategoriesController.findAllCategories);
    this.router.post(
      "/",
      validate(createProductCategoriesSchema),
      this.productCategoriesController.addCategory,
    );
    this.router.put(
      "/:id",
      validate(createProductCategoriesSchema),
      this.productCategoriesController.updateCategory,
    );
    this.router.delete("/:id", this.productCategoriesController.deleteCategory);
  }

}

export default new ProductCategoryRouter().router;
