"use client";

import React, { useState } from "react";
import { 
  MapPinIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  CheckCircleIcon,
  StarIcon as StarIconOutline
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAddress } from "../hooks/useAddress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddressForm } from "./AddressForm";

export const AddressTab = () => {
  const { addresses, isLoading, fetchAddresses, deleteAddress, setPrimaryAddress } = useAddress();
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setView("form");
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      try {
        await deleteAddress(id);
        toast.success("Alamat berhasil dihapus");
      } catch (err: any) {
        toast.error(err.message || "Gagal menghapus alamat");
      }
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await setPrimaryAddress(id);
      toast.success("Alamat utama berhasil diubah");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah alamat utama");
    }
  };

  if (view === "form") {
    return (
      <AddressForm 
        onClose={() => setView("list")} 
        onSuccess={fetchAddresses}
        address={selectedAddress} 
      />
    );
  }


  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h3 className="text-3xl font-bold text-slate-800">Daftar Alamat</h3>
          <p className="text-slate-400 mt-2 font-medium">Kelola alamat pengiriman Anda untuk memudahkan proses checkout.</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-6 py-6 h-auto font-bold shadow-lg shadow-teal-100 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Alamat Baru</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative bg-white rounded-[32px] p-8 border-2 transition-all duration-300 ${
                addr.isPrimary 
                  ? "border-teal-500 shadow-xl shadow-teal-50/50" 
                  : "border-slate-50 hover:border-slate-100 shadow-lg shadow-slate-50"
              }`}
            >
              {addr.isPrimary && (
                <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <CheckCircleIcon className="h-4 w-4" />
                  Utama
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${addr.isPrimary ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                   <MapPinIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-800">{addr.label}</h4>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{addr.type}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Penerima</span>
                  <span className="text-slate-700 font-bold">{addr.receiptName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telepon</span>
                  <span className="text-slate-700 font-medium">{addr.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Lengkap</span>
                  <span className="text-slate-600 font-medium text-sm leading-relaxed">{addr.address}</span>
                  <span className="text-slate-500 text-xs mt-1 font-bold">{addr.village}, {addr.district}, {addr.city}, {addr.province}</span>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(addr)}
                    className="h-10 w-10 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(addr.id)}
                    className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>

                {!addr.isPrimary && (
                  <Button 
                    variant="ghost"
                    onClick={() => handleSetPrimary(addr.id)}
                    className="text-xs font-bold text-slate-400 hover:text-teal-600 flex items-center gap-1.5"
                  >
                    <StarIconOutline className="h-4 w-4" />
                    Set Utama
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {addresses.length === 0 && !isLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6">
              <MapPinIcon className="h-10 w-10 text-slate-300" />
            </div>
            <h5 className="text-xl font-bold text-slate-700">Belum ada alamat</h5>
            <p className="text-slate-400 mt-2 max-w-xs font-medium">Tambahkan alamat pengiriman pertama Anda untuk mulai berbelanja.</p>
          </div>
        )}
      </div>
    </div>
  );
};

