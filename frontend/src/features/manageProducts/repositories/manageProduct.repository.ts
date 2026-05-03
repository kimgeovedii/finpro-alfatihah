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
    sortBy?: string,
    sortOrder?: string,
  ): Promise<ManageProductListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    return await apiFetch<ManageProductListResponse>(
      `/products?${params.toString()}`,
      "get",
    );
  };

  public createProduct = async (
    payload: CreateProductPayload,
  ): Promise<ManageProduct> => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        if (payload.images && Array.isArray(payload.images)) {
          payload.images.forEach((file) => {
            formData.append("images", file);
          });
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return await apiFetch<ManageProduct>("/products", "post", formData);
  };

  public updateProduct = async (
    id: string,
    payload: UpdateProductPayload,
  ): Promise<ManageProduct> => {
    if (
      payload.images &&
      Array.isArray(payload.images) &&
      payload.images.length > 0
    ) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") {
          if (payload.images && Array.isArray(payload.images)) {
            payload.images.forEach((file) => {
              formData.append("images", file);
            });
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      return await apiFetch<ManageProduct>(`/products/${id}`, "put", formData);
    }

    return await apiFetch<ManageProduct>(`/products/${id}`, "put", payload);
  };

  public deleteProduct = async (id: string): Promise<void> => {
    await apiFetch<void>(`/products/${id}`, "delete");
  };

  public getAllCategories = async (): Promise<ProductCategory[]> => {
    return await apiFetch<ProductCategory[]>("/product-categories", "get");
  };
}
