import { Router } from "express";
import { ProductImageController } from "../controllers/productImage.controller";
import { validate } from "../../../middleware/validate";
import {
  createProductImageSchema,
  updateProductImageSchema,
} from "../validations/productImage.schema";

export class ProductImageRouter {
  private router: Router;
  private imageController: ProductImageController;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.imageController = new ProductImageController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.imageController.getImages);
    this.router.post(
      "/",
      validate(createProductImageSchema),
      this.imageController.uploadImage,
    );
    this.router.delete(
      "/:imageId",
      validate(updateProductImageSchema),
      this.imageController.deleteImage,
    );
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
