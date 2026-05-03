import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller";
import { ProductDiscountController } from "../controllers/productDiscount.controller";
import { validate } from "../../../middleware/validate";
import {
  createDiscountSchema,
  updateDiscountSchema,
} from "../validations/discount.schema";
import { assignProductsSchema } from "../validations/productDiscount.schema";

import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class DiscountRouter {
  public router: Router;
  private discountController: DiscountController;
  private productDiscountController: ProductDiscountController;

  constructor() {
    this.router = Router();
    this.discountController = new DiscountController();
    this.productDiscountController = new ProductDiscountController();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      optionalAuthMiddleware,
      this.discountController.findAllDiscounts,
    );
    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN]),
      validate(createDiscountSchema),
      this.discountController.createDiscount,
    );
    this.router.put(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN]),
      validate(updateDiscountSchema),
      this.discountController.updateDiscount,
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN]),
      this.discountController.deleteDiscount,
    );

    this.router.post(
      "/:discountId/products",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN]),
      validate(assignProductsSchema),
      this.productDiscountController.assignProducts,
    );
    this.router.delete(
      "/:discountId/products/:productId",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN]),
      this.productDiscountController.removeProductDiscount,
    );
    this.router.get(
      "/:discountId/products",
      this.productDiscountController.getDiscountProducts,
    );
  }
}

export default new DiscountRouter().router;
