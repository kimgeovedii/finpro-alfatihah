import { ProductCard, PaginationMeta } from "@/features/home/types/home.types";
import { ProductCategory } from "@/features/manageCategories/types/manageCategory.type";

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  data: ProductCard[];
  meta: PaginationMeta;
}

export interface SearchState extends SearchFilters {
  products: ProductCard[];
  meta: PaginationMeta | null;
  categories: ProductCategory[];
  isLoading: boolean;
  isCategoriesLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  fetchProducts: (replace?: boolean) => Promise<void>;
  fetchCategories: () => Promise<void>;
  loadMore: () => Promise<void>;
}
