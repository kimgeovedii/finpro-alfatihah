import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller";
import { validate } from "../../../middleware/validate";
import {
  createDiscountSchema,
  updateDiscountSchema,
} from "../validations/discount.schema";

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;

  constructor() {
    this.router = Router();
    this.discountController = new DiscountController();
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
  }

  public getRouter(): Router {
    return this.router;
  }
}
