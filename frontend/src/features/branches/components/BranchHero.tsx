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
    <div className="relative rounded-lg h-[30vh] md:h-[40vh] min-h-[220px] md:min-h-[300px] bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/80 z-10" />
      <img 
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
        className="w-full h-full object-cover opacity-60 scale-105"
        alt={branch.storeName}
      />
      
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-3 sm:px-4 pb-6 md:pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white mb-3 md:mb-6 bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 transition-all text-xs md:text-sm font-bold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Back
            </button>
            
            <div className="flex items-start gap-3 md:gap-6">
              <div className="hidden md:flex w-20 h-20 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-[2rem] border border-white/20 items-center justify-center text-white shrink-0">
                <Store className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight">
                  {branch.storeName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/90">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-white/10">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    <span className="text-[10px] md:text-sm font-medium">{branch.city}, {branch.province}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-white/10">
                    <Package className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    <span className="text-[10px] md:text-sm font-medium">{totalProducts} Products</span>
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
