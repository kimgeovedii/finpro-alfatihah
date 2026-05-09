"use client";

import { motion } from "framer-motion";
import { 
  XMarkIcon, 
  BuildingStorefrontIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";
import { StoreDetail } from "../hooks/useNearestStoreMap";

interface StoreInfoModalProps {
  selectedStore: StoreDetail;
  onClose: () => void;
}

export const StoreInfoModal = ({ selectedStore, onClose }: StoreInfoModalProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="absolute inset-0 z-[1000] p-4 md:p-10 flex items-end md:items-center justify-center md:justify-end pointer-events-none"
  >
    <div className="glass-panel w-full max-w-[400px] md:max-w-[340px] max-h-[90%] overflow-y-auto rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/40 flex flex-col gap-6 relative bg-white/95 backdrop-blur-xl pointer-events-auto custom-scrollbar">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <button
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-primary z-10"
        onClick={onClose}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      <div className="flex flex-col gap-5">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
          <BuildingStorefrontIcon className="h-8 w-8 md:h-9 md:w-9" />
        </div>
        
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1 block">Store Information</span>
          <h3 className="text-xl md:text-2xl font-heading font-black text-slate-800 leading-tight">
            {selectedStore.name}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 mt-2 md:mt-3 leading-relaxed font-medium">
            {selectedStore.address}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 shrink-0" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <MapPinIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Distance</p>
              <p className="text-sm font-black text-slate-700">{selectedStore.distance || "Location not set"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Delivery Range</p>
              <p className="text-sm font-black text-slate-700">Max {selectedStore.maxDelivery}km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <a 
          href={`/${selectedStore.branchSlug}`}
          className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm text-center hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 block"
        >
          View Branch Detail
        </a>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm text-center hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/10 block"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  </motion.div>
);
