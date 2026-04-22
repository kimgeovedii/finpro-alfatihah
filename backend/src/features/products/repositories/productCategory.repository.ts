import { prisma } from "../../../config/prisma";

export class productCategoryRepository {
  public findAllCategories = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
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

  public createCategory = async (data: any) => {
    return await prisma.product_categories.create({
      data,
    });
  };

  public updateCategory = async (id: string, data: any) => {
    return await prisma.product_categories.update({
      where: {
        id,
      },
      data,
    });
  };

  public deleteCategory = async (id: string) => {
    return await prisma.product_categories.delete({
      where: {
        id,
      },
    });
  };

  public findByName = async (name: string) => {
    return await prisma.product_categories.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  };
}
