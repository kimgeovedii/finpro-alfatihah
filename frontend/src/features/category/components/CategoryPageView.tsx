"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSearchStore } from "@/features/search/service/search.service";
import { useSearchFilters } from "@/features/search/hooks/useSearchFilters";
import { SearchSidebar } from "@/features/search/components/SearchSidebar";
import { SearchHeader } from "@/features/search/components/SearchHeader";
import { SearchResults } from "@/features/search/components/SearchResults";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export const CategoryPageView = () => {
  const params = useParams();
  const slug = params.slug as string;

  const {
    categories,
    fetchCategories,
  } = useSearchStore();

  useSearchFilters(true);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slugName === slug);
  }, [categories, slug]);

  if (categories.length > 0 && !currentCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-black text-slate-800">Category not found</h2>
        <Link href="/search" className="text-primary hover:underline font-bold">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto pb-2 custom-scrollbar">
        <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors shrink-0">
          <HomeIcon className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRightIcon className="w-3 h-3 shrink-0" />
        <span className="shrink-0">Categories</span>
        <ChevronRightIcon className="w-3 h-3 shrink-0" />
        <span className="text-primary shrink-0">{currentCategory?.name || "Loading..."}</span>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col gap-10">
        <SearchHeader />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <SearchSidebar />

          <main className="flex-1">
            <SearchResults />
          </main>
        </div>
      </div>
    </div>
  );
};
