import { productCategoryRepository } from "../repositories/productCategory.repository";

export class ProductCategoryService {
  private productCategoryRepository: productCategoryRepository;

  constructor() {
    this.productCategoryRepository = new productCategoryRepository();
  }

  public findAllCategories = async (
    filters: any,
    page: number,
    limit: number,
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

    const { data, total } =
      await this.productCategoryRepository.findAllCategories(where, skip, take);

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
    return await this.productCategoryRepository.deleteCategory(id);
  };
}
