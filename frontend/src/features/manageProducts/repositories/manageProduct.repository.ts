import { apiFetch } from "@/utils/api";
import {
  ManageProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ManageProduct,
  ProductCategory,
} from "@/features/manageProducts/types/manageProduct.type";

export class ManageProductRepository {
  public getAllProducts = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    categoryId?: string,
  ): Promise<ManageProductListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);

    return await apiFetch<ManageProductListResponse>(
      `/products?${params.toString()}`,
      "get",
    );
  };

  public createProduct = async (
    payload: CreateProductPayload,
  ): Promise<ManageProduct> => {
    return await apiFetch<ManageProduct>("/products", "post", payload);
  };

  public updateProduct = async (
    id: string,
    payload: UpdateProductPayload,
  ): Promise<ManageProduct> => {
    return await apiFetch<ManageProduct>(`/products/${id}`, "put", payload);
  };

  public deleteProduct = async (id: string): Promise<void> => {
    await apiFetch<void>(`/products/${id}`, "delete");
  };

  public getAllCategories = async (): Promise<ProductCategory[]> => {
    return await apiFetch<ProductCategory[]>("/product-categories", "get");
  };
}
