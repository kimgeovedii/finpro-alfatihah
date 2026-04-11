import { ProductImageRepository } from "../repositories/productImage.repository";

export class ProductImageService {
  private productImageRepository: ProductImageRepository;

  constructor() {
    this.productImageRepository = new ProductImageRepository();
  }

  public getImages = async () => {
    return await this.productImageRepository.getImages();
  };

  public getImageById = async (id: string) => {
    return await this.productImageRepository.getImageById(id);
  };

  public createImage = async (data: any) => {
    return await this.productImageRepository.createImage(data);
  };

  public updateImage = async (id: string, data: any) => {
    return await this.productImageRepository.updateImage(id, data);
  };

  public deleteImage = async (id: string) => {
    return await this.productImageRepository.deleteImage(id);
  };
}
