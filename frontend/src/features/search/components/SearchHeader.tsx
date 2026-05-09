"use client";

import { useSearchStore } from "../service/search.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { usePriceFilter } from "../hooks/usePriceFilter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const SearchHeader = () => {
  const {
    query,
    sortBy,
    sortOrder,
    meta,
    categories,
    categoryId,
    minPrice,
    maxPrice,
  } = useSearchStore();
  const { updateFilters } = useCatalogFilters();
  const { localMin, localMax, handlePriceChange } = usePriceFilter();
  const pathname = usePathname();
  const isCategoryPage = pathname.startsWith("/categories/");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-7">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {query ? `Results for "${query}"` : "Product Catalog"}
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            {query
              ? `Showing ${meta?.total || 0} items for your search.`
              : "Browse our selection of fresh and premium products."}
          </p>
        </div>

        <div className="flex flex-nowrap items-center justify-between lg:justify-end gap-2 pb-1 overflow-x-auto custom-scrollbar lg:overflow-visible">
          {/* Mobile Category Filter */}
          <div className="lg:hidden shrink-0">
            <Select
              value={categoryId || "all"}
              onValueChange={(value) =>
                updateFilters({ categoryId: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-[130px] h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[10px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
                <SelectItem
                  value="all"
                  className={cn(
                    "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                    !categoryId &&
                      "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                  )}
                >
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className={cn(
                      "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                      categoryId === cat.id &&
                        "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                    )}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Price Filter */}
          <div className="lg:hidden shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 px-3 min-w-[120px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[10px] transition-all",
                    (minPrice || maxPrice) &&
                      "border-[#006666]/50 ring-1 ring-[#006666]/10",
                  )}
                >
                  <FunnelIcon
                    className={cn(
                      "w-3.5 h-3.5 mr-1.5 transition-colors",
                      minPrice || maxPrice
                        ? "text-[#006666]"
                        : "text-slate-400",
                    )}
                  />
                  Price
                  <ChevronDownIcon className="w-2.5 h-2.5 ml-1.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-5 rounded-2xl border-slate-100 dark:border-slate-800 shadow-2xl"
                align="center"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm text-slate-800 dark:text-slate-200">
                      Price Range
                    </p>
                    {(minPrice || maxPrice) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateFilters({
                            minPrice: undefined,
                            maxPrice: undefined,
                          })
                        }
                        className="h-7 px-2 text-[10px] font-bold text-red-500 hover:bg-red-50"
                      >
                        <XMarkIcon className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400">
                        Min
                      </Label>
                      <Input
                        type="number"
                        value={localMin || ""}
                        onChange={(e) =>
                          handlePriceChange("min", e.target.value)
                        }
                        placeholder="0"
                        className="h-10 text-xs font-bold rounded-lg border-slate-200 focus:border-[#006666] focus:ring-[#006666]/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400">
                        Max
                      </Label>
                      <Input
                        type="number"
                        value={localMax || ""}
                        onChange={(e) =>
                          handlePriceChange("max", e.target.value)
                        }
                        placeholder="Any"
                        className="h-10 text-xs font-bold rounded-lg border-slate-200 focus:border-[#006666] focus:ring-[#006666]/10"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sorting */}
          <div className="shrink-0">
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                updateFilters({
                  sortBy: field,
                  sortOrder: order as "asc" | "desc",
                });
              }}
            >
              <SelectTrigger className="w-[130px] lg:w-[180px] h-10 lg:h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[10px] lg:text-xs">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
                <SelectItem
                  value="createdAt-desc"
                  className={cn(
                    "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                    `${sortBy}-${sortOrder}` === "createdAt-desc" &&
                      "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                  )}
                >
                  Newest
                </SelectItem>
                <SelectItem
                  value="basePrice-asc"
                  className={cn(
                    "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                    `${sortBy}-${sortOrder}` === "basePrice-asc" &&
                      "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                  )}
                >
                  Lowest prices
                </SelectItem>
                <SelectItem
                  value="basePrice-desc"
                  className={cn(
                    "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                    `${sortBy}-${sortOrder}` === "basePrice-desc" &&
                      "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                  )}
                >
                  Highest prices
                </SelectItem>
                <SelectItem
                  value="productName-asc"
                  className={cn(
                    "text-xs font-bold py-3 transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] cursor-pointer",
                    `${sortBy}-${sortOrder}` === "productName-asc" &&
                      "text-[#006666] bg-[#f0fdfa] focus:bg-[#f0fdfa] focus:text-[#006666]",
                  )}
                >
                  Name (A - Z)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
