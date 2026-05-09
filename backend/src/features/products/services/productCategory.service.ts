import { productCategoryRepository } from "../repositories/productCategory.repository";
import { prisma } from "../../../config/prisma";

export class ProductCategoryService {
  private productCategoryRepository: productCategoryRepository;

  constructor() {
    this.productCategoryRepository = new productCategoryRepository();
  }

  public findAllCategories = async (
    filters: any,
    page: number,
    limit: number,
    sortBy: string = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const where: any = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: "insensitive",
      };
    }

    if (filters.includeDeleted === "true" || filters.includeDeleted === true) {
      where.includeDeleted = true;
    }

    const { data, total } =
      await this.productCategoryRepository.findAllCategories(
        where,
        skip,
        take,
        sortBy,
        sortOrder,
      );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  public createCategory = async (data: any) => {
    const existing = await this.productCategoryRepository.findByName(data.name);
    if (existing) {
      throw new Error("Category name already exists");
    }

    if (!data.slugName) {
      data.slugName = data.name.toLowerCase().replace(/ /g, "-");
    }

    return await this.productCategoryRepository.createCategory(data);
  };

  public updateCategory = async (id: string, data: any) => {
    if (data.name) {
      const existing = await this.productCategoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error("Category name already exists");
      }

      if (!data.slugName) {
        data.slugName = data.name.toLowerCase().replace(/ /g, "-");
      }
    }

    return await this.productCategoryRepository.updateCategory(id, data);
  };

  public deleteCategory = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      let otherCategory = await tx.product_categories.findFirst({
        where: {
          OR: [
            { name: { equals: "Other", mode: "insensitive" } },
            { slugName: { equals: "other", mode: "insensitive" } },
          ],
          deletedAt: null,
        },
      });

      if (!otherCategory) {
        otherCategory = await tx.product_categories.findFirst({
          where: {
            OR: [
              { name: { equals: "Other", mode: "insensitive" } },
              { slugName: { equals: "other", mode: "insensitive" } },
            ],
            deletedAt: { not: null },
          },
        });

        if (otherCategory) {
          otherCategory = await tx.product_categories.update({
            where: { id: otherCategory.id },
            data: { deletedAt: null },
          });
        } else {
          otherCategory = await tx.product_categories.create({
            data: {
              name: "Other",
              slugName: "other",
              description: "General category for products without a specific category",
            },
          });
        }
      }

      if (id === otherCategory.id) {
        throw new Error("Cannot delete the General/Other category");
      }
      await tx.products.updateMany({
        where: { categoryId: id },
        data: { categoryId: otherCategory.id },
      });

      return await tx.product_categories.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  };
}
