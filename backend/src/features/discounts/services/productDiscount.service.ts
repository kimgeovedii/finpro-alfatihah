import { ProductDiscountRepository } from "../repositories/productDiscount.repository";

export class ProductDiscountService {
  private productDiscountRepository: ProductDiscountRepository;

  constructor() {
    this.productDiscountRepository = new ProductDiscountRepository();
  }

  public async assignProducts(discountId: string, productIds: string[]) {
    return await this.productDiscountRepository.assignProducts(
      discountId,
      productIds,
    );
  }

  public async removeProductDiscount(discountId: string, productId: string) {
    return await this.productDiscountRepository.removeProductDiscount(
      discountId,
      productId,
    );
  }

  public async getProductsByDiscount(discountId: string) {
    return await this.productDiscountRepository.getProductsByDiscount(
      discountId,
    );
  }
}
