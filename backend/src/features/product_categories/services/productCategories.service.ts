import { productCategoriesRepository } from "../repositories/productCategories.repository";

export class ProductCategoriesServices {
  private productCategoriesRepository: productCategoriesRepository;

  constructor() {
    this.productCategoriesRepository = new productCategoriesRepository();
  }

  public findAll = async (filters: any, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.productCategoriesRepository.findAll(
      filters,
      skip,
      take,
    );

    const where: any = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: "insensitive",
      };
    }

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

  public create = async (data: any) => {
    return await this.productCategoriesRepository.create(data);
  };

  public update = async (id: string, data: any) => {
    return await this.productCategoriesRepository.update(id, data);
  };

  public delete = async (id: string) => {
    return await this.productCategoriesRepository.delete(id);
  };
}
