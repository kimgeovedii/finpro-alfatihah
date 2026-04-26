import { motion } from "framer-motion";
import { MapPin, Store, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { BranchData, PaginationMeta } from "@/features/home/types/home.types";

import { useRouter } from "next/navigation";

interface BranchHeroProps {
  branch: BranchData;
  totalProducts: number;
}

export const BranchHero = ({ branch, totalProducts }: BranchHeroProps) => {
  const router = useRouter();

  return (
    <div className="relative h-[40vh] min-h-[300px] bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/80 z-10" />
      <img 
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
        className="w-full h-full object-cover opacity-60 scale-105"
        alt={branch.storeName}
      />
      
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all text-sm font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex items-start gap-6">
              <div className="hidden md:flex w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 items-center justify-center text-white shrink-0">
                <Store className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  {branch.storeName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{branch.city}, {branch.province}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{totalProducts} Produk Tersedia</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
