import { create } from "zustand";
import { ProductRepository } from "@/features/products/repositories/product.repository";
import { ProductDetailData } from "@/features/products/types/product.type";

interface ProductState {
  searchResults: ProductDetailData[];
  searchMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  isSearching: boolean;
  searchError: string | null;

  searchProducts: (query: string, page?: number) => Promise<void>;
  clearSearch: () => void;
}

const repository = new ProductRepository();

export const useProductStore = create<ProductState>((set) => ({
  searchResults: [],
  searchMeta: null,
  isSearching: false,
  searchError: null,

  searchProducts: async (query, page = 1) => {
    if (!query.trim()) {
      set({ searchResults: [], searchMeta: null });
      return;
    }

    set({ isSearching: true, searchError: null });
    try {
      const response = await repository.searchProducts(query, page);
      set({
        searchResults: response.data,
        searchMeta: response.meta,
        isSearching: false,
      });
    } catch (error: any) {
      set({
        searchError: error.message || "Failed to search products",
        isSearching: false,
      });
    }
  },

  clearSearch: () => set({ searchResults: [], searchMeta: null, searchError: null }),
}));
