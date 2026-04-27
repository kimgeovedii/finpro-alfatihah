import { Loader2, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const BranchLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center space-y-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
      <p className="text-slate-500 font-medium">Memuat toko...</p>
    </div>
  </div>
);

export const BranchError = ({ error }: { error?: string | null }) => (
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
