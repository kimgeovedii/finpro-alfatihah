import { prisma } from "../../../config/prisma";

export class productCategoryRepository {
  public findAllCategories = async (
    filters: any,
    skip?: number,
    take?: number,
    sortBy: string = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) => {
    const { includeDeleted, ...otherFilters } = filters;
    const where = {
      ...otherFilters,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };
    const [data, total] = await prisma.$transaction([
      prisma.product_categories.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.product_categories.count({
        where,
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
    return await prisma.product_categories.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
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
        deletedAt: null,
      },
    });
  };
}
