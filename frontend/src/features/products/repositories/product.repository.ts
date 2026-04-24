import { apiFetch } from "@/utils/api";
import { ProductDetailData } from "@/features/products/types/product.type";

export class ProductRepository {
  public async getProductBySlug(slugName: string, storeName: string) {
    return await apiFetch<ProductDetailData>(`/products/branch/${storeName}/${slugName}`, "get");
  }
}
