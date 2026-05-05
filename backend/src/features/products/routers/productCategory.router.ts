import { Router } from "express";
import { ProductCategoryController } from "../controllers/productCategory.controller";
import { createProductCategoriesSchema } from "../validations/productCategory.schema";
import { validate } from "../../../middleware/validate";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class ProductCategoryRouter {
  public router: Router;
  private productCategoriesController: ProductCategoryController;

  constructor() {
    this.router = Router();
    this.productCategoriesController = new ProductCategoryController();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/", 
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN, EmployeeRole.STORE_ADMIN]),
      this.productCategoriesController.findAllCategories
    );
    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      validate(createProductCategoriesSchema),
      this.productCategoriesController.addCategory,
    );
    this.router.put(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      validate(createProductCategoriesSchema),
      this.productCategoriesController.updateCategory,
    );
    this.router.delete(
      "/:id", 
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      this.productCategoriesController.deleteCategory
    );
  }

}

export default new ProductCategoryRouter().router;
