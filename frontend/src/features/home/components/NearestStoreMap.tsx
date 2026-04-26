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
  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);
  const { searchCoords, setSearchCoords, fetchNearestBranch, setLocationStatus } = useHomeStore();

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

  const handleShowStore = useCallback((name: string, address: string, distance: string) => {
    setSelectedStore({ name, address, distance });
  }, []);

  return (
    <section className="transition-all duration-500 ease-in-out mb-8">
      {!isExpanded ? (
        <motion.div
          layoutId="map-container"
          className="glass-panel rounded-full px-8 py-5 flex items-center justify-between shadow-sm border border-primary/10 cursor-pointer hover:bg-white/60 transition-colors"
          onClick={() => {
            setIsExpanded(true);
            if (onRequestLocation) onRequestLocation();
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-primary">
                View Nearest Stores
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Find branches around you
              </p>
            </div>
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95">
            Open Map
            <ChevronDownIcon className="h-4 w-4" />
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

            <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start z-[1000] gap-4">
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto pointer-events-auto">
                <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-xl bg-white/90 backdrop-blur-md">
                  <select 
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none p-1 min-w-[120px] border-b md:border-b-0 md:border-r border-slate-200"
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
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none p-1 min-w-[120px] border-b md:border-b-0 md:border-r border-slate-200 disabled:opacity-50"
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
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none p-1 min-w-[120px] disabled:opacity-50"
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

                  <button 
                    onClick={handleLocationSearch}
                    disabled={isSearchingLocation || !selectedProvince}
                    className="bg-primary text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl font-black hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
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
                        if (userCoords) {
                          fetchNearestBranch(userCoords.lat, userCoords.lng);
                        }
                        toast.success("Kembali ke lokasi Anda");
                      }}
                      className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center"
                      title="Kembali ke lokasi saya"
                    >
                      <MapPinIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl flex items-center gap-6 shadow-xl pointer-events-auto bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-slate-700">
                    Branches
                  </span>
                </div>
                {userCoords && nearestBranch && (
                  <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-700">
                      Max {nearestBranch.maxDeliveryDistance}km
                    </span>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {selectedStore && (
                <motion.div
                  initial={{ x: "110%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "110%" }}
                  className="absolute top-0 right-0 h-full w-full max-w-[320px] z-[1000] p-6 flex flex-col justify-center"
                >
                  <div className="glass-panel rounded-[2rem] p-8 shadow-2xl border border-white/50 flex flex-col gap-4 relative bg-white/90 backdrop-blur-md">
                    <button
                      className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors"
                      onClick={() => setSelectedStore(null)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white mb-2">
                      <BuildingStorefrontIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-primary leading-tight">
                        {selectedStore.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 font-medium">
                        {selectedStore.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 w-fit px-3 py-1 rounded-full">
                      <MapPinIcon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-primary">
                        {selectedStore.distance}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                className="glass-panel bg-white/90 hover:bg-white text-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-primary/20"
                onClick={() => setIsExpanded(false)}
              >
                Close maps
                <ChevronUpIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};
