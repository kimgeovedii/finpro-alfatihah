import { DiscountRepository } from "../repositories/discount.repository";

export class DiscountService {
  private discountRepository: DiscountRepository;

  constructor() {
    this.discountRepository = new DiscountRepository();
  }

  public findAllDiscounts = async (
    filters: any,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.discountRepository.findAllDiscounts(
      filters,
      skip,
      take,
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

  public createDiscount = async (data: any) => {
    return await this.discountRepository.createDiscount(data);
  };

  public updateDiscount = async (id: string, data: any) => {
    return await this.discountRepository.updateDiscount(id, data);
  };

  public deleteDiscount = async (id: string) => {
    return await this.discountRepository.deleteDiscount(id);
  };
}
