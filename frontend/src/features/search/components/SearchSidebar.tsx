"use client";

import { useState } from "react";
import { useSearchStore } from "../service/search.service";
import {
  ChevronRightIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { usePriceFilter } from "../hooks/usePriceFilter";
import { useCategoryList } from "../hooks/useCategoryList";

export const SearchSidebar = () => {
  const { categories, categoryId, isCategoriesLoading, minPrice, maxPrice } =
    useSearchStore();
  const { updateFilters } = useSearchFilters();
  const { localMin, localMax, handlePriceChange } = usePriceFilter();
  const { visibleCategories, hasMore, loadMore } = useCategoryList(categories);

  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isPriceExpanded, setIsPriceExpanded] = useState(false);
  const pathname = usePathname();
  const isCategoryPage = pathname.startsWith("/categories/");

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
      <Card className="rounded-[1.5rem] border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader
          className="cursor-pointer lg:cursor-default select-none"
          onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black tracking-tight">
              Categories
            </CardTitle>
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-300 lg:hidden",
                isCategoryExpanded ? "rotate-180" : "",
              )}
            />
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "space-y-1 p-3",
            !isCategoryExpanded && "hidden lg:block",
          )}
        >
          {!isCategoryPage && (
            <button
              onClick={() => updateFilters({ categoryId: "" })}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-xs group",
                !categoryId
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary",
              )}
            >
              <span>All Products</span>
              {!categoryId && <ChevronRightIcon className="w-3 h-3" />}
            </button>
          )}

          {isCategoriesLoading
            ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl mx-1"
                />
              ))
            : visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilters({ categoryId: cat.id })}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-xs text-left group",
                    categoryId === cat.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary",
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                  {categoryId === cat.id && (
                    <ChevronRightIcon className="w-3 h-3" />
                  )}
                </button>
              ))}

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              className="w-full mt-2 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 rounded-xl py-4"
            >
              <ChevronDownIcon className="w-3 h-3 mr-2" />
              Show More
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-slate-100 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader
          className="cursor-pointer lg:cursor-default select-none"
          onClick={() => setIsPriceExpanded(!isPriceExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black tracking-tight">
              Price Range
            </CardTitle>
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-300 lg:hidden",
                isPriceExpanded ? "rotate-180" : "",
              )}
            />
          </div>
        </CardHeader>
        <CardContent
          className={cn("space-y-6", !isPriceExpanded && "hidden lg:block")}
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Min Price
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  Rp
                </span>
                <Input
                  type="number"
                  value={localMin || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  placeholder="0"
                  className="h-12 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Max Price
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  Rp
                </span>
                <Input
                  type="number"
                  value={localMax || ""}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  placeholder="1.000.000+"
                  className="h-12 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {(minPrice || maxPrice) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateFilters({ minPrice: undefined, maxPrice: undefined })
              }
              className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500"
            >
              <XMarkIcon className="w-3 h-3 mr-2" />
              Reset Price
            </Button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
