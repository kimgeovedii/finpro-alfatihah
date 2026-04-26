"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../types/home.types";

interface ProductListProps {
  products: ProductCard[];
  isLoading: boolean;
}

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  if (isLoading) {
    return (
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-black">Recommendations</h2>
            <p className="text-muted-foreground mt-2">Loading freshest products near you...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-2xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-black">Recommendations</h2>
            <p className="text-muted-foreground mt-2">Specially picked for you</p>
          </div>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-muted-foreground">No products available at this branch.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-black text-gray-900">
            Recommendations
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Specially picked for you from the nearest store
          </p>
        </div>
        <Link href="/products" className="group flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors">
          See All 
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/products/${product.slugName}`}>
              <div className="relative aspect-square rounded-3xl bg-gray-100 mb-4 overflow-hidden">
                <img 
                  src={product.productImages[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.currentStock <= 5 && product.currentStock > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Only {product.currentStock} left!
                  </div>
                )}
                {product.currentStock === 0 && (
                  <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Out of Stock
                  </div>
                )}
                <button 
                  className="absolute bottom-4 right-4 bg-white text-primary p-3 rounded-full shadow-lg opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white disabled:opacity-50"
                  disabled={product.currentStock === 0}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation when clicking the cart button
                    // Add to cart logic will go here
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {product.category.name}
                </p>
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.productName}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">
                    Rp {product.basePrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
