import { prisma } from "../../../config/prisma";
import { getDiscountStatusFilter } from "../utils/discountStatus.util";

export class DiscountRepository {
  public findAllDiscounts = async (
    filters: any,
    skip?: number,
    take?: number,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) => {
    let finalFilters = { ...filters };

    if (finalFilters.status) {
      const statusFilter = getDiscountStatusFilter(finalFilters.status);
      delete finalFilters.status;
      finalFilters = { ...finalFilters, ...statusFilter };
    }

    const [data, total] = await prisma.$transaction([
      prisma.discounts.findMany({
        where: finalFilters,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          branch: {
            select: {
              storeName: true,
              city: true,
            },
          },
          productDiscounts: {
            include: {
              product: {
                select: {
                  productName: true,
                },
              },
            },
          },
        },
      }),
      prisma.discounts.count({
        where: finalFilters,
      }),
    ]);
    return { data, total };
  };

  public getDiscountById = async (id: string) => {
    return prisma.discounts.findUnique({
      where: { id },
    });
  };

  public createDiscount = async (data: any) => {
    const { productIds, ...discountData } = data;

    return prisma.discounts.create({
      data: {
        ...discountData,
        productDiscounts: {
          create: (productIds || []).map((productId: string) => ({
            productId,
          })),
        },
      },
      include: {
        productDiscounts: true,
      },
    });
  };

  public updateDiscount = async (id: string, data: any) => {
    const { productIds, ...discountData } = data;

    return prisma.$transaction(async (tx) => {
      if (productIds) {
        await tx.product_discounts.deleteMany({
          where: { discountId: id },
        });

        if (productIds.length > 0) {
          await tx.product_discounts.createMany({
            data: productIds.map((productId: string) => ({
              discountId: id,
              productId,
            })),
          });
        }
      }

      return tx.discounts.update({
        where: { id },
        data: discountData,
        include: {
          productDiscounts: true,
        },
      });
    });
  };

  public deleteDiscount = async (id: string) => {
    return prisma.discounts.delete({
      where: { id },
    });
  };
}
