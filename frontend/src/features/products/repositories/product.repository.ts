import { apiFetch } from "@/utils/api";
import { ProductDetailData } from "@/features/products/types/product.type";

export class ProductRepository {
  public async getProductBySlug(slugName: string, storeName: string) {
    return await apiFetch<ProductDetailData>(`/products/branch/${storeName}/${slugName}`, "get");
  }

  public async searchProducts(query: string, page: number = 1, limit: number = 10) {
    return await apiFetch<any>(`/products?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, "get");
  }
}
