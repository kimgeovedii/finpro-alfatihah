import { useProductStore } from "@/services/product.service";
import { useCallback } from "react";

export const useProductSearch = () => {
  const {
    searchResults,
    searchMeta,
    isSearching,
    searchError,
    searchProducts,
    clearSearch,
  } = useProductStore();

  const handleSearch = useCallback((query: string) => {
    return searchProducts(query);
  }, [searchProducts]);

  return {
    searchResults,
    searchMeta,
    isSearching,
    searchError,
    handleSearch,
    clearSearch,
  };
};
