"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchStore } from "../service/search.service";

export const useSearchFilters = () => {
  const { setFilters, fetchProducts, query, categoryId, products, isLoading } =
    useSearchStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    useSearchStore.getState().fetchCategories();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const catId = searchParams.get("categoryId") || "";

    if (q !== query || catId !== categoryId) {
      setFilters({
        query: q,
        categoryId: catId,
      });
    } else if (!products.length && !isLoading) {
      fetchProducts();
    }
  }, [searchParams, setFilters, fetchProducts]);

  const updateFilters = (newFilters: { query?: string; categoryId?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.query !== undefined) {
      if (newFilters.query) params.set("q", newFilters.query);
      else params.delete("q");
    }
    
    if (newFilters.categoryId !== undefined) {
      if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
      else params.delete("categoryId");
    }

    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return { updateFilters };
};
