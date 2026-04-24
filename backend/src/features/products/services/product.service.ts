import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public findAllProducts = async (
    filters: any,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = { ...filters };
    if (where.search) {
      where.productName = { contains: where.search, mode: "insensitive" };
      delete where.search;
    }

    const { data, total } = await this.productRepository.findAllProducts(
      where,
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

  public getProductById = async (id: string) => {
    return await this.productRepository.getProductById(id);
  };

  public getProductBySlug = async (slugName: string, userId: string | null, branchName: string) => {
    return await this.productRepository.getProductBySlug(slugName, userId, branchName);
  };

  public createProduct = async (data: any) => {
    return await this.productRepository.createProduct(data);
  };

  public updateProduct = async (id: string, data: any) => {
    return await this.productRepository.updateProduct(id, data);
  };

  public deleteProduct = async (id: string) => {
    return await this.productRepository.deleteProduct(id);
  };
}
