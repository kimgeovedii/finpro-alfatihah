"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchStore } from "../service/search.service";

export const useSearchFilters = () => {
  const {
    setFilters,
    fetchProducts,
    query,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    products,
    isLoading,
  } = useSearchStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    useSearchStore.getState().fetchCategories();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const catId = searchParams.get("categoryId") || "";
    const minP = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxP = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const sort = searchParams.get("sortBy") || "createdAt";
    const order = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const hasChanged =
      q !== query ||
      catId !== categoryId ||
      minP !== minPrice ||
      maxP !== maxPrice ||
      sort !== sortBy ||
      order !== sortOrder;

    if (hasChanged) {
      setFilters({
        query: q,
        categoryId: catId,
        minPrice: minP,
        maxPrice: maxP,
        sortBy: sort,
        sortOrder: order,
      });
    } else if (!products.length && !isLoading) {
      fetchProducts();
    }
  }, [searchParams, setFilters, fetchProducts]);

  const updateFilters = (newFilters: {
    query?: string;
    categoryId?: string;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      const paramKey = key === "query" ? "q" : key;
      if (value !== undefined && value !== "") {
        params.set(paramKey, String(value));
      } else {
        params.delete(paramKey);
      }
    });

    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  return { updateFilters };
};
