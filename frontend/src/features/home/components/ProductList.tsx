"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../types/home.types";
import { useHomeStore } from "@/features/home/service/home.service";
import { ProductCardItem } from "./ProductCardItem";

// Sub-component: Skeleton Loader
const ProductSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="bg-slate-100 aspect-square rounded-[2rem]" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-100 rounded-full w-1/3" />
      <div className="h-5 bg-slate-100 rounded-xl w-3/4" />
      <div className="h-6 bg-slate-100 rounded-xl w-1/2" />
    </div>
  </div>
);

// Sub-component: Empty State
const EmptyProducts = () => (
  <section className="py-2">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900">
          Recommendations
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          Specially picked for you
        </p>
      </div>
    </div>
    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        No Products Found
      </h3>
      <p className="text-slate-500 max-w-xs mx-auto">
        We couldn't find any products right now. Try searching in another
        location.
      </p>
    </div>
  </section>
);

interface ProductListProps {
  products: ProductCard[];
  isLoading: boolean;
}

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  const {
    productsMeta,
    fetchNearestBranch,
    userCoords,
    productLocationCoords,
    isProductsLoadingMore,
    nearestBranch,
  } = useHomeStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (
      productsMeta &&
      productsMeta.page < productsMeta.totalPages &&
      !isProductsLoadingMore
    ) {
      const lat = productLocationCoords?.lat || userCoords?.lat;
      const lng = productLocationCoords?.lng || userCoords?.lng;
      fetchNearestBranch(lat, lng, productsMeta.page + 1);
    }
  }, [
    productsMeta,
    isProductsLoadingMore,
    productLocationCoords,
    userCoords,
    fetchNearestBranch,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  const isLocationSet = !!(productLocationCoords || userCoords);

  if (isLoading) {
    return (
      <section className="py-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="h-10 bg-slate-100 rounded-xl w-64 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-lg w-48 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {[...Array(10)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <section className="py-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Recommendations
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {isLocationSet
              ? "Specially picked for you from the nearest store"
              : "Our best products, specially picked for you"}
          </p>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-all self-start sm:self-auto bg-primary/5 px-6 py-3 rounded-full hover:bg-primary/10"
        >
          See All
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8">
        {products.map((product, index) => (
          <ProductCardItem
            key={product.id}
            product={product}
            index={index}
            branchName={product.branchName}
            branchId={product.branchId}
            branchCity={product.branchCity}
          />
        ))}

        {isProductsLoadingMore &&
          [...Array(4)].map((_, i) => <ProductSkeleton key={`more-${i}`} />)}
      </div>

      {/* Sentinel for infinite scroll */}
      <div
        ref={loadMoreRef}
        className="h-20 w-full flex items-center justify-center mt-10"
      >
        {isProductsLoadingMore && (
          <div className="flex items-center gap-3 text-slate-400 font-bold animate-pulse">
            <ChevronDown className="w-5 h-5 animate-bounce" />
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </section>
  );
};
