import { DiscountRepository } from "../repositories/discount.repository";
import { getDiscountStatus } from "../utils/discountStatus.util";

export class DiscountService {
  private discountRepository: DiscountRepository;

  constructor() {
    this.discountRepository = new DiscountRepository();
  }

  public findAllDiscounts = async (query: any, user?: any) => {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...restQuery
    } = query;

    const filters: any = { ...restQuery };

    if (search) {
      filters.name = { contains: search as string, mode: "insensitive" };
    }

    if (user?.employee?.role === "STORE_ADMIN") {
      filters.branchId = user.employee.branchId;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const { data, total } = await this.discountRepository.findAllDiscounts(
      filters,
      skip,
      take,
      sortBy as string,
      sortOrder as "asc" | "desc",
    );

    const dataWithStatus = data.map((discount: any) => {
      return {
        ...discount,
        status: getDiscountStatus(discount.startDate, discount.endDate),
      };
    });

    return {
      data: dataWithStatus,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  };

  public getDiscountById = async (id: string) => {
    const discount = await this.discountRepository.getDiscountById(id);
    if (!discount) throw new Error("Discount not found");
    return discount;
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
