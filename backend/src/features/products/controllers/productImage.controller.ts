import { NextFunction, Request, Response } from "express";
import { ProductImageService } from "../services/productImage.service";

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
      res.status(200).send({
        message: `Get image urls successfully for product ${productId}`,
        data,
      });
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
      res.status(200).send({
        message: `Upload image url successfully for product ${productId}`,
        data,
      });
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
      res.status(200).send({
        message: `Delete image url successfully for product ${productId}`,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
