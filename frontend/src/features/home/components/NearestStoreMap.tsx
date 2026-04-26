"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MapIcon,
  ChevronDownIcon,
  MapPinIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { BranchData } from "../types/home.types";
import { regionService, Region } from "@/services/region.service";
import { useHomeStore } from "@/features/home/service/home.service";
import toast from "react-hot-toast";

interface StoreDetail {
  name: string;
  address: string;
  distance: string;
  maxDelivery: number;
}

interface NearestStoreMapProps {
  branches: BranchData[];
  userCoords: { lat: number; lng: number } | null;
  nearestBranch: BranchData | null;
  onRequestLocation?: () => void;
}

export const NearestStoreMap = ({ 
  branches, 
  userCoords, 
  nearestBranch,
  onRequestLocation 
}: NearestStoreMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);
  const { 
    searchCoords, 
    setSearchCoords, 
    fetchNearestBranch, 
    setLocationStatus, 
    allBranchesMeta, 
    fetchAllBranches 
  } = useHomeStore();

  const handleLoadMoreBranches = () => {
    if (allBranchesMeta && allBranchesMeta.page < allBranchesMeta.totalPages) {
      fetchAllBranches(allBranchesMeta.page + 1);
    }
  };

  // Region State
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<{code: string, name: string} | null>(null);
  const [selectedCity, setSelectedCity] = useState<{code: string, name: string} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{code: string, name: string} | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      regionService.getProvinces().then(setProvinces).catch(console.error);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (selectedProvince) {
      regionService.getRegencies(selectedProvince.code).then(setRegencies).catch(console.error);
      setSelectedCity(null);
      setSelectedDistrict(null);
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      regionService.getDistricts(selectedCity.code).then(setDistricts).catch(console.error);
      setSelectedDistrict(null);
    }
  }, [selectedCity]);

  const handleLocationSearch = async () => {
    if (!selectedProvince) {
      toast.error("Pilih setidaknya provinsi");
      return;
    }

    setIsSearchingLocation(true);
    try {
      const query = [
        selectedDistrict?.name,
        selectedCity?.name,
        selectedProvince.name,
        "Indonesia"
      ].filter(Boolean).join(", ");

      const results = await regionService.searchAddress(query);
      if (results && results.length > 0) {
        const bestResult = results[0];
        const newCoords = {
          lat: parseFloat(bestResult.lat),
          lng: parseFloat(bestResult.lon)
        };
        
        setSearchCoords(newCoords);
        setLocationStatus("granted");
        fetchNearestBranch(newCoords.lat, newCoords.lng);
        toast.success(`Berhasil menemukan lokasi: ${selectedDistrict?.name || selectedCity?.name || selectedProvince.name}`);
      } else {
        toast.error("Lokasi tidak ditemukan pada peta");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Gagal mencari lokasi");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const LeafletMapContent = useMemo(
    () =>
      dynamic(
        () =>
          import("@/features/home/components/LeafletMapContent").then((mod) => mod.LeafletMapContent),
        {
          ssr: false,
          loading: () => (
            <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center font-bold text-primary">
              Loading Map...
            </div>
          ),
        },
      ),
    [],
  );

  const handleShowStore = useCallback((name: string, address: string, distance: string, maxDelivery: number) => {
    setSelectedStore({ name, address, distance, maxDelivery });
  }, []);

  return (
    <section className="transition-all duration-500 ease-in-out mb-8">
      {!isExpanded ? (
        <motion.div
          layoutId="map-container"
          className="glass-panel rounded-[2rem] md:rounded-full px-5 md:px-8 py-4 md:py-5 flex items-center justify-between shadow-sm border border-primary/10 cursor-pointer hover:bg-white/60 transition-all active:scale-[0.99]"
          onClick={() => {
            setIsExpanded(true);
            if (onRequestLocation) onRequestLocation();
          }}
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl md:rounded-full flex items-center justify-center shrink-0">
              <MapIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-primary text-sm md:text-base truncate">
                View Nearest Stores
              </h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">
                Find branches around you
              </p>
            </div>
          </div>
          <button className="bg-primary text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-primary-container transition-all shrink-0">
            <span className="hidden sm:inline">Open Map</span>
            <span className="sm:hidden">Open</span>
            <ChevronDownIcon className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div className="animate-in fade-in zoom-in duration-300">
          <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden border border-primary/10 shadow-2xl bg-slate-50">
            <LeafletMapContent 
              onSelectStore={handleShowStore} 
              branches={branches}
              userCoords={userCoords ? [userCoords.lat, userCoords.lng] : undefined}
              searchCoords={searchCoords ? [searchCoords.lat, searchCoords.lng] : undefined}
            />

            <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex flex-col md:flex-row justify-between items-start z-[1000] gap-4">
              <div className="flex flex-col gap-2 w-full md:w-auto pointer-events-auto">
                {/* Mobile Filter Toggle */}
                <div className="md:hidden flex items-center gap-2">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="glass-panel bg-white/90 p-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-primary active:scale-95 transition-all"
                  >
                    <MapIcon className="h-4 w-4" />
                    {isFilterOpen ? "Hide Filters" : "Filter by Location"}
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {searchCoords && (
                    <button 
                      onClick={() => {
                        setSearchCoords(null);
                        setSelectedProvince(null);
                        setSelectedCity(null);
                        setSelectedDistrict(null);
                        if (userCoords) fetchNearestBranch(userCoords.lat, userCoords.lng);
                        toast.success("Kembali ke lokasi Anda");
                      }}
                      className="glass-panel bg-blue-500 p-3 rounded-2xl shadow-xl text-white active:scale-95 transition-all"
                    >
                      <MapPinIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                  {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.div 
                      initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { height: 0, opacity: 0 } : false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="glass-panel p-3 md:p-2 rounded-[1.5rem] md:rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 flex-1">
                        <select 
                          className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] md:border-r border-slate-200"
                          value={selectedProvince?.code || ""}
                          onChange={(e) => {
                            const p = provinces.find(x => x.code === e.target.value);
                            setSelectedProvince(p ? {code: p.code, name: p.name} : null);
                          }}
                        >
                          <option value="">Pilih Provinsi</option>
                          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>

                        <select 
                          className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] md:border-r border-slate-200 disabled:opacity-50"
                          value={selectedCity?.code || ""}
                          disabled={!selectedProvince}
                          onChange={(e) => {
                            const c = regencies.find(x => x.code === e.target.value);
                            setSelectedCity(c ? {code: c.code, name: c.name} : null);
                          }}
                        >
                          <option value="">Pilih Kota</option>
                          {regencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>

                        <select 
                          className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] disabled:opacity-50"
                          value={selectedDistrict?.code || ""}
                          disabled={!selectedCity}
                          onChange={(e) => {
                            const d = districts.find(x => x.code === e.target.value);
                            setSelectedDistrict(d ? {code: d.code, name: d.name} : null);
                          }}
                        >
                          <option value="">Pilih Kecamatan</option>
                          {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleLocationSearch}
                          disabled={isSearchingLocation || !selectedProvince}
                          className="flex-1 md:flex-none bg-primary text-white text-[10px] uppercase tracking-widest px-6 py-3 md:py-2 rounded-xl font-black hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isSearchingLocation ? "Searching..." : "Search"}
                        </button>

                        {searchCoords && (
                          <button 
                            onClick={() => {
                              setSearchCoords(null);
                              setSelectedProvince(null);
                              setSelectedCity(null);
                              setSelectedDistrict(null);
                              if (userCoords) fetchNearestBranch(userCoords.lat, userCoords.lng);
                              toast.success("Kembali ke lokasi Anda");
                            }}
                            className="hidden md:flex bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all active:scale-95 items-center justify-center"
                            title="Kembali ke lokasi saya"
                          >
                            <MapPinIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Legend - Hide on mobile if filter is open to save space */}
              <AnimatePresence>
                {(!isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel p-3 md:p-4 rounded-2xl flex items-center gap-4 md:gap-6 shadow-xl pointer-events-auto bg-white/90 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-tight">Branches</span>
                    </div>
                    {userCoords && nearestBranch && (
                      <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-tight">
                          Max {nearestBranch.maxDeliveryDistance}km
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedStore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 z-[1000] p-4 md:p-10 flex items-end md:items-center justify-center md:justify-end pointer-events-none"
                >
                  <div className="glass-panel w-full max-w-[400px] md:max-w-[340px] max-h-[90%] overflow-y-auto rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/40 flex flex-col gap-6 relative bg-white/95 backdrop-blur-xl pointer-events-auto custom-scrollbar">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <button
                      className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-primary z-10"
                      onClick={() => setSelectedStore(null)}
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

                    <button 
                      onClick={() => setSelectedStore(null)}
                      className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-black/10 shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedStore && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 w-max">
                {allBranchesMeta && allBranchesMeta.page < allBranchesMeta.totalPages && (
                  <button
                    className="glass-panel bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-primary/20 hover:bg-emerald-700"
                    onClick={handleLoadMoreBranches}
                  >
                    Load More Stores
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  className="glass-panel bg-white/90 hover:bg-white text-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-primary/20"
                  onClick={() => setIsExpanded(false)}
                >
                  Close maps
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Always show close on desktop or as a small button on top-right mobile when store is selected */}
            {selectedStore && (
               <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
                <button
                  className="glass-panel bg-white/90 hover:bg-white text-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-primary/20"
                  onClick={() => setIsExpanded(false)}
                >
                  Close maps
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
};
