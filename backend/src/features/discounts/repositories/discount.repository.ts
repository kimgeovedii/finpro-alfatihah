import { prisma } from "../../../config/prisma";

export class DiscountRepository {
  public findAllDiscounts = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.discounts.findMany({
        where: filters,
        skip,
        take,
      }),
      prisma.discounts.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public createDiscount = async (data: any) => {
    return prisma.discounts.create({
      data,
    });
  };

  public updateDiscount = async (id: string, data: any) => {
    return prisma.discounts.update({
      where: { id },
      data,
    });
  };

  public deleteDiscount = async (id: string) => {
    return prisma.discounts.delete({
      where: { id },
    });
  };
}
