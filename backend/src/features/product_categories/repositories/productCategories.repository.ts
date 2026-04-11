import { prisma } from "../../../config/prisma";

export class productCategoriesRepository {
  public findAll = async (filters: any, skip?: number, take?: number) => {
    const [data, total] = await prisma.$transaction([
      prisma.product_categories.findMany({
        where: filters,
        skip,
        take,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.product_categories.count({
        where: filters,
      }),
    ]);
    return { data, total };
  };

  public create = async (data: any) => {
    return await prisma.product_categories.create({
      data,
    });
  };

  public update = async (id: string, data: any) => {
    return await prisma.product_categories.update({
      where: {
        id,
      },
      data,
    });
  };

  public delete = async (id: string) => {
    return await prisma.product_categories.delete({
      where: {
        id,
      },
    });
  };
}
