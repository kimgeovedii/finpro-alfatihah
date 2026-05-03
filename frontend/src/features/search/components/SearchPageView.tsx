"use client";

import { useSearchFilters } from "../hooks/useSearchFilters";
import { SearchSidebar } from "./SearchSidebar";
import { SearchHeader } from "./SearchHeader";
import { SearchResults } from "./SearchResults";

export const SearchPageView = () => {
  useSearchFilters();

  return (
    <div className="flex flex-col gap-10 py-8 md:py-12">
      <SearchHeader />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <SearchSidebar />

        <main className="flex-1">
          <SearchResults />
        </main>
      </div>
    </div>
  );
};
