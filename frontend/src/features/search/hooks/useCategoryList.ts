"use client";

import { useState, useCallback } from "react";
import { ProductCategory } from "@/features/manageCategories/types/manageCategory.type";

export const useCategoryList = (categories: ProductCategory[]) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 5);
  }, []);

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMore = categories.length > visibleCount;

  return {
    visibleCategories,
    hasMore,
    loadMore,
  };
};
