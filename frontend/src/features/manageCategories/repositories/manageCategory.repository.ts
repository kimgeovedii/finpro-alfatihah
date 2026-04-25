import { apiFetch } from "@/utils/api";
import {
  ManageCategoryListResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ProductCategory,
} from "@/features/manageCategories/types/manageCategory.type";

export class ManageCategoryRepository {
  public getAllCategories = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ManageCategoryListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("name", search);

    return await apiFetch<ManageCategoryListResponse>(
      `/product-categories?${params.toString()}`,
      "get",
    );
  };

  public createCategory = async (
    payload: CreateCategoryPayload,
  ): Promise<ProductCategory> => {
    return await apiFetch<ProductCategory>(
      "/product-categories",
      "post",
      payload,
    );
  };

  public updateCategory = async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<ProductCategory> => {
    return await apiFetch<ProductCategory>(
      `/product-categories/${id}`,
      "put",
      payload,
    );
  };

  public deleteCategory = async (id: string): Promise<void> => {
    await apiFetch<void>(`/product-categories/${id}`, "delete");
  };
}
