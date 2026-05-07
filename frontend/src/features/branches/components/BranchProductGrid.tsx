import { Package } from "lucide-react";
import { ProductCard, PaginationMeta } from "@/features/home/types/home.types";
import { ProductCardItem } from "@/features/home/components/ProductCardItem";

interface BranchProductGridProps {
  products: ProductCard[];
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export const BranchProductGrid = ({ products, meta, onPageChange }: BranchProductGridProps) => {
  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Semua Produk ({products.length})</h2>
        <div className="h-px bg-slate-200 flex-1 mx-8 hidden sm:block" />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCardItem 
              key={`${product.id}-${index}`} 
              product={product} 
              index={index}
              branchName={product.branchName}
              branchId={product.branchId}
              branchSlug={product.branchSlug}
              branchCity={product.branchCity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Tidak ada produk</h3>
          <p className="text-slate-500">Toko ini sedang tidak memiliki stok produk saat ini.</p>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 flex gap-2">
            {[...Array(meta.totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  meta.page === i + 1 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
