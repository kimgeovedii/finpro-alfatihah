import { apiFetch } from "@/utils/api";
import { ProductDetailData } from "@/features/products/types/product.type";

export class ProductRepository {
  public async getProductBySlug(slugName: string) {
    return await apiFetch<ProductDetailData>(`/products/slug/${slugName}`, "get");
  }
}
