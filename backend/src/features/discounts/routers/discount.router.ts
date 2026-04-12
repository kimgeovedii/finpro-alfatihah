import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller";
import { ProductDiscountController } from "../controllers/productDiscount.controller";
import { validate } from "../../../middleware/validate";
import {
  createDiscountSchema,
  updateDiscountSchema,
} from "../validations/discount.schema";
import { assignProductsSchema } from "../validations/productDiscount.schema";

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;
  private productDiscountController: ProductDiscountController;

  constructor() {
    this.router = Router();
    this.discountController = new DiscountController();
    this.productDiscountController = new ProductDiscountController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.discountController.findAllDiscounts);
    this.router.post(
      "/",
      validate(createDiscountSchema),
      this.discountController.createDiscount,
    );
    this.router.put(
      "/:id",
      validate(updateDiscountSchema),
      this.discountController.updateDiscount,
    );
    this.router.delete("/:id", this.discountController.deleteDiscount);

    this.router.post(
      "/:discountId/products",
      validate(assignProductsSchema),
      this.productDiscountController.assignProducts,
    );
    this.router.delete(
      "/:discountId/products/:productId",
      this.productDiscountController.removeProductDiscount,
    );
    this.router.get(
      "/:discountId/products",
      this.productDiscountController.getDiscountProducts,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
