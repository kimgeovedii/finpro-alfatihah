"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "../types/home.types";
import { toast } from "sonner";

interface ProductCardItemProps {
  product: ProductCard;
  index: number;
  branchName?: string;
  branchId?: string;
  branchCity?: string;
}

export const ProductCardItem = ({ product, index, branchName, branchId, branchCity }: ProductCardItemProps) => {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.error("Pemberitahuan", {
      description: "Fitur tambah ke keranjang sedang dalam pengembangan",
    });
  };

  const handleCardClick = () => {
    router.push(`/products/${product.slugName}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 8) * 0.05 }}
      className="group h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-full glass-panel bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-3 border border-white/40 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col group/card">
        
        {/* Image Container */}
        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100/50 dark:bg-slate-800/50 mb-4">
          <img 
            src={product.productImages[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.currentStock <= 5 && product.currentStock > 0 && (
              <div className="bg-orange-500/90 backdrop-blur-md text-white text-[9px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                Low Stock
              </div>
            )}
          </div>

          {/* Sold Out Overlay */}
          {product.currentStock === 0 && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-slate-900/90 text-white text-[10px] uppercase font-black px-5 py-2.5 rounded-full shadow-2xl border border-white/10">
                Habis Terjual
              </span>
            </div>
          )}

          {/* Hover Action Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.currentStock === 0}
            className="absolute bottom-3 right-3 bg-primary text-white p-3.5 rounded-2xl shadow-2xl opacity-0 translate-y-4 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0 hover:bg-emerald-600 active:scale-90 z-20"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-1 pb-1">
          <div className="mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-1 block">
              {product.category.name}
            </span>
            <h3 className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 group-hover/card:text-primary transition-colors line-clamp-2 leading-snug h-10">
              {product.productName}
            </h3>
          </div>

          <div className="mt-auto pt-3 flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Rp {product.basePrice.toLocaleString("id-ID")}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400 line-through">Rp {(product.basePrice * 1.2).toLocaleString("id-ID")}</span>
                <span className="text-[10px] font-black text-orange-500">20%</span>
              </div>
            </div>

            {/* Branch Info - Glassy Footer */}
            {branchName && (
              <Link 
                href={branchId ? `/branches/${branchId}` : "#"} 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 py-2 px-3 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/30 hover:bg-primary/10 transition-colors group/branch"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover/branch:bg-primary/20 transition-colors">
                  <Store className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {branchName} {branchCity ? `• ${branchCity}` : ""}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
