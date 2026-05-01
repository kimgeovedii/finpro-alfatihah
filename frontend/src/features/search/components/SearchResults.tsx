"use client";

import {
  ShoppingCartIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { ProductCardItem } from "@/features/home/components/ProductCardItem";
import { useSearchStore } from "../service/search.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-square rounded-[2rem]" />
    <div className="space-y-2 px-1">
      <Skeleton className="h-3 w-1/3 rounded-full" />
      <Skeleton className="h-5 w-3/4 rounded-xl" />
      <Skeleton className="h-6 w-1/2 rounded-xl" />
    </div>
  </div>
);

const EmptyResults = () => (
  <div className="text-center py-24 bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 backdrop-blur-sm">
    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
      <ShoppingCartIcon className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
      No Products Found
    </h3>
    <p className="text-slate-500 max-w-xs mx-auto font-medium text-sm">
      We couldn't find any products matching your current filters. Try adjusting
      your search or category.
    </p>
    <Button
      variant="link"
      onClick={() => useSearchStore.getState().resetFilters()}
      className="mt-6 text-primary font-black text-xs uppercase tracking-widest"
    >
      Clear All Filters
    </Button>
  </div>
);

export const SearchResults = () => {
  const {
    products,
    isLoading,
    isLoadingMore,
    loadMore,
    fetchProducts,
    meta,
    error,
  } = useSearchStore();

  const { observerTarget } = useInfiniteScroll({
    loadMore,
    hasMore: !!meta && meta.page < meta.totalPages,
    isLoading: isLoadingMore || isLoading,
  });

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {[...Array(9)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50/50 dark:bg-red-900/10 rounded-[3rem] border border-dashed border-red-200 dark:border-red-800">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-black text-red-800 dark:text-red-400 mb-2 tracking-tight">
          Search Failed
        </h3>
        <p className="text-red-500/80 max-w-xs mx-auto font-medium text-sm mb-6">
          {error}
        </p>
        <Button
          variant="outline"
          onClick={() => fetchProducts(true)}
          className="rounded-full border-red-200 text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest"
        >
          <ArrowPathIcon className="w-3 h-3 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return <EmptyResults />;
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {products.map((product, index) => (
          <ProductCardItem
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            branchName={product.branchName}
            branchId={product.branchId}
            branchCity={product.branchCity}
          />
        ))}
      </div>

      <div
        ref={observerTarget}
        className="h-20 w-full flex items-center justify-center"
      >
        {isLoadingMore && (
          <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-widest animate-pulse">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!isLoadingMore && meta && meta.page < meta.totalPages && (
          <div className="flex flex-col items-center gap-1.5 text-slate-300">
            <ChevronDownIcon className="w-5 h-5 animate-bounce" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Scroll for more
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
