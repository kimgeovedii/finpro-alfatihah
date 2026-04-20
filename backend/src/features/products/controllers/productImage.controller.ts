import { NextFunction, Request, Response } from "express";
import { ProductImageService } from "../services/productImage.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class ProductImageController {
  private productImageService: ProductImageService;

  constructor() {
    this.productImageService = new ProductImageService();
  }

  public getImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const data = await this.productImageService.getImages();
      sendSuccess(
        res,
        data,
        `Get image urls successfully for product ${productId}`,
      );
    } catch (error) {
      next(error);
    }
  };

  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const data = await this.productImageService.createImage(req.body);
      sendSuccess(
        res,
        data,
        `Upload image url successfully for product ${productId}`,
      );
    } catch (error) {
      next(error);
    }
  };

  public deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId, imageId } = req.params;
      const data = await this.productImageService.deleteImage(
        imageId as string,
      );
      sendSuccess(
        res,
        data,
        `Delete image url successfully for product ${productId}`,
      );
    } catch (error) {
      next(error);
    }
  };
}
