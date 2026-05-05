import { apiFetch } from "@/utils/api";
import {
  ManageProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ManageProduct,
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
    const shouldUseFormData =
      (payload.images && Array.isArray(payload.images) && payload.images.length > 0) ||
      (payload.existingImageIds && Array.isArray(payload.existingImageIds));

    if (shouldUseFormData) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") {
          if (payload.images && Array.isArray(payload.images)) {
            payload.images.forEach((file) => {
              formData.append("images", file);
            });
          }
        } else if (key === "existingImageIds") {
          if (payload.existingImageIds && Array.isArray(payload.existingImageIds)) {
            payload.existingImageIds.forEach((id) => {
              formData.append("existingImageIds", id);
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

  public getAllCategories = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    includeDeleted: boolean = false,
  ): Promise<any> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("name", search);
    if (includeDeleted) params.set("includeDeleted", "true");

    return await apiFetch<any>(`/product-categories?${params.toString()}`, "get");
  };
}
