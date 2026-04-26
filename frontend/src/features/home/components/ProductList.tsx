"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../types/home.types";
import { useHomeStore } from "@/features/home/service/home.service";

interface ProductListProps {
  products: ProductCard[];
  isLoading: boolean;
}

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  const { productsMeta, fetchNearestBranch, userCoords, searchCoords, isProductsLoadingMore } = useHomeStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (productsMeta && productsMeta.page < productsMeta.totalPages && !isProductsLoadingMore) {
      const lat = searchCoords?.lat || userCoords?.lat;
      const lng = searchCoords?.lng || userCoords?.lng;
      fetchNearestBranch(lat, lng, productsMeta.page + 1);
    }
  }, [productsMeta, isProductsLoadingMore, searchCoords, userCoords, fetchNearestBranch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="h-10 bg-slate-100 rounded-xl w-64 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-lg w-48 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-slate-100 aspect-square rounded-[2rem]" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                <div className="h-5 bg-slate-100 rounded-xl w-3/4" />
                <div className="h-6 bg-slate-100 rounded-xl w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-12">
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
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            We couldn't find any products at this branch. Try searching in another location.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 tracking-tight">
            Recommendations
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Specially picked for you from the nearest store
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 8) * 0.05 }}
            className="group"
          >
            <Link href={`/products/${product.slugName}`}>
              <div className="relative aspect-square rounded-[2rem] bg-slate-50 mb-5 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-500">
                <img 
                  src={product.productImages[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                {product.currentStock <= 5 && product.currentStock > 0 && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg">
                    Low Stock: {product.currentStock}
                  </div>
                )}
                {product.currentStock === 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-[10px] uppercase font-black px-4 py-2 rounded-full shadow-xl">
                      Sold Out
                    </span>
                  </div>
                )}
                
                <button 
                  className="absolute bottom-4 right-4 bg-white text-primary p-3.5 rounded-2xl shadow-2xl opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white disabled:opacity-0 active:scale-90"
                  disabled={product.currentStock === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart logic
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  {product.category.name}
                </p>
                <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                  {product.productName}
                </h3>
                <p className="font-black text-lg text-slate-900">
                  Rp {product.basePrice.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}

        {isProductsLoadingMore && [1, 2, 3, 4].map((i) => (
          <div key={`more-${i}`} className="animate-pulse space-y-4">
            <div className="bg-slate-100 aspect-square rounded-[2rem]" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
              <div className="h-5 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-6 bg-slate-100 rounded-xl w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={loadMoreRef} className="h-20 w-full flex items-center justify-center mt-10">
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
