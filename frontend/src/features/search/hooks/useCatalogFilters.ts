"use client";

import { usePathname } from "next/navigation";
import { useSearchFilters } from "./useSearchFilters";
import { useCategoryFilters } from "./useCategoryFilters";

export const useCatalogFilters = (autoSync: boolean = false) => {
  const pathname = usePathname();
  const searchFilters = useSearchFilters(pathname === "/search" ? autoSync : false);
  const categoryFilters = useCategoryFilters(pathname.startsWith("/categories/") ? autoSync : false);

  if (pathname.startsWith("/categories/")) {
    return categoryFilters;
  }
  
  return searchFilters;
};
