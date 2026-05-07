"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSearchStore } from "../service/search.service";
import { useHomeStore } from "@/features/home/service/home.service";

export const useSearchFilters = (autoSync: boolean = false) => {
  const {
    setFilters,
    fetchProducts,
    query,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    branchId,
    products,
    meta,
    isLoading,
  } = useSearchStore();
  const { nearestBranch } = useHomeStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (autoSync) {
      useSearchStore.getState().fetchCategories();
    }
  }, [autoSync]);

  useEffect(() => {
    if (!autoSync) return;

    const q = searchParams.get("q") || "";
    let catId = searchParams.get("categoryId") || "";

    // If we are on a category page, the categoryId comes from the slug in the pathname
    if (pathname.startsWith("/categories/")) {
      const slug = pathname.split("/").pop();
      const cat = useSearchStore.getState().categories.find((c) => c.slugName === slug);
      if (cat) {
        catId = cat.id;
      }
    }

    const minP = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxP = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const sort = searchParams.get("sortBy") || "createdAt";
    const order = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    
    // Branch ID comes from the global home store (nearest branch)
    const bId = nearestBranch?.id || "";

    const hasChanged =
      q !== query ||
      catId !== categoryId ||
      minP !== minPrice ||
      maxP !== maxPrice ||
      sort !== sortBy ||
      order !== sortOrder ||
      bId !== branchId;

    if (hasChanged) {
      // Small delay to ensure categories are loaded before we set filters if we depend on them
      setFilters({
        query: q,
        categoryId: catId,
        minPrice: minP,
        maxPrice: maxP,
        sortBy: sort,
        sortOrder: order,
        branchId: bId,
      });
    } else if (!meta && !isLoading) {
      fetchProducts();
    }
  }, [autoSync, searchParams, pathname, setFilters, fetchProducts, query, categoryId, minPrice, maxPrice, sortBy, sortOrder, branchId, nearestBranch?.id, meta, isLoading]);

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

    let targetPathname = pathname;
    
    // Smooth URL navigation for categories
    if (newFilters.categoryId !== undefined) {
      params.delete("categoryId"); // Always remove from query if we handle it via slug
      
      if (newFilters.categoryId === "") {
        targetPathname = "/search";
      } else {
        const cat = useSearchStore.getState().categories.find(c => c.id === newFilters.categoryId);
        if (cat) {
          targetPathname = `/categories/${cat.slugName}`;
        } else {
          // Fallback if category not found in store yet
          params.set("categoryId", newFilters.categoryId);
          targetPathname = "/search";
        }
      }
    }

    router.push(`${targetPathname}?${params.toString()}`);
  };

  return { updateFilters };
};
