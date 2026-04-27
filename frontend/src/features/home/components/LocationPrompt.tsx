"use client";

import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useNearestStore } from "../hooks/useNearestStore";

export const LocationPrompt = () => {
  const { locationStatus, requestLocation } = useNearestStore();

  if (locationStatus === "granted" || locationStatus === "requesting") {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-primary-container/30 to-tertiary-container/30 rounded-2xl p-6 md:p-8 relative overflow-hidden border border-primary/10">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <MapPin className="w-32 h-32" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-xl md:text-2xl font-heading font-black mb-2 text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Cari Toko Terdekat
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Izinkan akses lokasi untuk melihat produk dari cabang terdekat dari posisi Anda saat ini.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={requestLocation}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-colors text-sm whitespace-nowrap"
          >
            <Navigation className="w-4 h-4" />
            Izinkan Akses Lokasi
          </motion.button>
          
          {locationStatus === "denied" && (
            <p className="text-[10px] text-red-500 font-bold text-center md:text-left animate-pulse">
              Akses lokasi ditolak. Menggunakan cabang default.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
