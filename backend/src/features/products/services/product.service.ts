import { ProductRepository } from "../repositories/product.repository";
import { cloudinaryUpload } from "../../../config/cloudinary";

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

    const { sortBy = "createdAt", sortOrder = "desc", ...restFilters } = filters;
    const orderDir = (sortOrder === "asc" || sortOrder === "desc") ? sortOrder : "desc";

    const where: any = { ...restFilters, deletedAt: null };
    if (where.search) {
      where.productName = { contains: where.search, mode: "insensitive" };
      delete where.search;
    }

    if (where.minPrice || where.maxPrice) {
      where.basePrice = {};
      if (where.minPrice) {
        where.basePrice.gte = parseFloat(where.minPrice);
        delete where.minPrice;
      }
      if (where.maxPrice) {
        where.basePrice.lte = parseFloat(where.maxPrice);
        delete where.maxPrice;
      }
    }

    const { data, total } = await this.productRepository.findAllProducts(
      where,
      skip,
      take,
      sortBy,
      orderDir,
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

  public createProduct = async (data: any, files?: Express.Multer.File[]) => {
    const payload = { ...data };

    if (files && Array.isArray(files) && files.length > 0) {
      const imageUrls: string[] = [];
      for (const file of files) {
        try {
          const result = await cloudinaryUpload(file, "products");
          imageUrls.push(result.secure_url);
        } catch (cloudinaryError: any) {
          throw new Error(`Image upload failed: ${cloudinaryError.message}`);
        }
      }
      payload.imageUrls = imageUrls;
    }

    return await this.productRepository.createProduct(payload);
  };

  public updateProduct = async (
    id: string,
    data: any,
    files?: Express.Multer.File[],
  ) => {
    const payload = { ...data };
    const existingImageIds = this.parseExistingImageIds(payload.existingImageIds);
    delete payload.existingImageIds;

    if (files && Array.isArray(files) && files.length > 0) {
      const imageUrls: string[] = [];
      for (const file of files) {
        try {
          const result = await cloudinaryUpload(file, "products");
          imageUrls.push(result.secure_url);
        } catch (cloudinaryError: any) {
          throw new Error(`Image upload failed: ${cloudinaryError.message}`);
        }
      }
      payload.imageUrls = imageUrls;
    }

    return await this.productRepository.updateProduct(
      id,
      payload,
      existingImageIds,
    );
  };

  private parseExistingImageIds = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter((id) => typeof id === "string");
    if (typeof data === "string") return data.split(",").map((id) => id.trim()).filter(Boolean);
    return [];
  };
  public deleteProduct = async (id: string) => {
    return await this.productRepository.deleteProduct(id);
  };
}
