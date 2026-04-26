"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { HomeRepository } from "@/features/home/repository/home.repository";
import { NearestBranchResponse, ProductCard } from "@/features/home/types/home.types";
import { ProductCardItem } from "@/features/home/components/ProductCardItem";
import { MapPin, Store, ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const repository = new HomeRepository();

export const BranchDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<NearestBranchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repository.getBranchDetail(id as string);
      console.log("Branch Detail Response:", res);
      setData(res);
    } catch (err: any) {
      console.error("Fetch Detail Error:", err);
      setError(err.message || "Gagal memuat detail toko");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id, fetchDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Memuat toko...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Toko Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-8">{error || "Toko yang Anda cari mungkin sudah tidak aktif."}</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const { branch, products } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
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
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all text-sm font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
              
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
                      <span className="text-sm font-medium">{products.meta.total} Produk Tersedia</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar / Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/50 sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Lokasi Toko
              </h3>
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {branch.storeName} {branch.city ? `• ${branch.city}` : ""}
                </span>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {branch.address}
                </p>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Koordinat</p>
                  <p className="text-xs font-bold text-slate-500">{branch.latitude}, {branch.longitude}</p>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Layanan Pengiriman</p>
                  <p className="text-xs font-bold text-slate-500">Maks. {branch.maxDeliveryDistance} KM dari lokasi toko</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Semua Produk ({products?.data?.length || 0})</h2>
              <div className="h-px bg-slate-200 flex-1 mx-8 hidden sm:block" />
            </div>

            {(products?.data?.length || 0) > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {products.data.map((product, index) => (
                  <ProductCardItem 
                    key={product.id} 
                    product={product} 
                    index={index}
                    branchName={product.branchName}
                    branchId={product.branchId}
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

            {/* Pagination Placeholder */}
            {products.meta.totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 flex gap-2">
                  {[...Array(products.meta.totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        products.meta.page === i + 1 
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
        </div>
      </div>
    </div>
  );
};
