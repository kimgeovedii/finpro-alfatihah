import { prisma } from "../../../config/prisma";

export class ProductDiscountRepository {
  public assignProducts = async (discountId: string, productIds: string[]) => {
    const data = productIds.map((productId) => ({
      discountId,
      productId,
    }));

    return prisma.product_discounts.createMany({
      data,
      skipDuplicates: true,
    });
  };

  public removeProductDiscount = async (
    discountId: string,
    productId: string,
  ) => {
    return prisma.product_discounts.deleteMany({
      where: {
        discountId,
        productId,
      },
    });
  };

  public getProductsByDiscount = async (discountId: string) => {
    return prisma.product_discounts.findMany({
      where: {
        discountId,
      },
      include: {
        product: true,
      },
    });
  };
}
