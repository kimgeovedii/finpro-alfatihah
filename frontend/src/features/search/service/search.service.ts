import { create } from "zustand";
import { SearchState, SearchFilters } from "../types/search.types";
import { SearchRepository } from "../repository/search.repository";

const repository = new SearchRepository();

const initialFilters: SearchFilters = {
  query: "",
  categoryId: "",
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 12,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  ...initialFilters,
  products: [],
  meta: null,
  categories: [],
  isLoading: false,
  isCategoriesLoading: false,
  isLoadingMore: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({ ...state, ...newFilters, page: 1 })); // Reset page when filters change
    get().fetchProducts(true);
  },

  resetFilters: () => {
    set({ ...initialFilters, products: [] });
    get().fetchProducts(true);
  },

  fetchProducts: async (replace = true) => {
    const { query, categoryId, minPrice, maxPrice, sortBy, sortOrder, branchId, page, limit } = get();
    
    if (replace) set({ isLoading: true, error: null });
    else set({ isLoadingMore: true });

    try {
      const response = await repository.searchProducts({
        query,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        branchId,
        page,
        limit,
      });

      set((state) => ({
        products: replace ? response.data : [...state.products, ...response.data],
        meta: response.meta,
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch products", 
        isLoading: false, 
        isLoadingMore: false 
      });
    }
  },

  fetchCategories: async () => {
    set({ isCategoriesLoading: true });
    try {
      const response = await repository.getCategories();
      set({ categories: response.data, isCategoriesLoading: false });
    } catch (error) {
      set({ isCategoriesLoading: false });
    }
  },

  loadMore: async () => {
    const { meta, isLoadingMore, isLoading } = get();
    if (!meta || meta.page >= meta.totalPages || isLoadingMore || isLoading) return;

    set({ page: meta.page + 1 });
    await get().fetchProducts(false);
  },
}));
