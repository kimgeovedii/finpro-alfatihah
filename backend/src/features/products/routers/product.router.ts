import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.schema";
import { validate } from "../../../middleware/validate";
import { ProductImageRouter } from "./productImage.router";
import { memoryUploader } from "../../../middleware/uploader.middleware";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      this.productController.findAllProducts,
    );
    this.router.get(
      "/slug/:slugName",
      this.productController.getProductBySlug,
    );
    this.router.get(
      "/:id",
      this.productController.getProductById,
    );
    
    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      memoryUploader().array("images", 10),
      validate(createProductSchema),
      this.productController.createProduct,
    );

    this.router.put(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      memoryUploader().array("images", 10),
      validate(updateProductSchema),
      this.productController.updateProduct,
    );
    
    this.router.delete(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.SUPER_ADMIN]),
      this.productController.deleteProduct,
    );

    const productImageRouter = new ProductImageRouter().getRouter();
    this.router.use("/:productId/images", productImageRouter);
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
