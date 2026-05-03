import { apiFetch } from "@/utils/api";
import { SearchFilters, SearchResponse } from "../types/search.types";
import { ManageCategoryListResponse } from "@/features/manageCategories/types/manageCategory.type";

export class SearchRepository {
  public async searchProducts(filters: SearchFilters): Promise<SearchResponse> {
    const params = new URLSearchParams();
    if (filters.query) params.set("search", filters.query);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    return await apiFetch<SearchResponse>(
      `/products?${params.toString()}`,
      "get",
    );
  }

  public async getCategories(): Promise<ManageCategoryListResponse> {
    return await apiFetch<ManageCategoryListResponse>(
      "/product-categories?limit=100",
      "get",
    );
  }
}
