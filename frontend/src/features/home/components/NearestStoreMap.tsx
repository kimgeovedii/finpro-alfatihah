"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MapIcon,
  ChevronDownIcon,
  MapPinIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { BranchData } from "../types/home.types";
import { useNearestStoreMap } from "../hooks/useNearestStoreMap";
import { MapLocationFilter } from "./MapLocationFilter";
import { MapLegend } from "./MapLegend";
import { StoreInfoModal } from "./StoreInfoModal";
import toast from "react-hot-toast";

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
  
  const {
    isFilterOpen,
    setIsFilterOpen,
    selectedStore,
    setSelectedStore,
    searchCoords,
    setSearchCoords,
    fetchNearestBranch,
    allBranchesMeta,
    provinces,
    regencies,
    districts,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    setSelectedProvince,
    setSelectedCity,
    setSelectedDistrict,
    isSearchingLocation,
    handleLocationSearch,
    handleLoadMoreBranches,
    handleShowStore,
  } = useNearestStoreMap(isExpanded, userCoords);

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

  return (
    <section className="transition-all duration-500 ease-in-out mt-2 mb-2">
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
                  {(isFilterOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.div 
                      initial={(typeof window !== 'undefined' && window.innerWidth < 768) ? { height: 0, opacity: 0 } : false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="glass-panel p-3 md:p-2 rounded-[1.5rem] md:rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden"
                    >
                      <MapLocationFilter 
                        provinces={provinces}
                        regencies={regencies}
                        districts={districts}
                        selectedProvince={selectedProvince}
                        selectedCity={selectedCity}
                        selectedDistrict={selectedDistrict}
                        setSelectedProvince={setSelectedProvince}
                        setSelectedCity={setSelectedCity}
                        setSelectedDistrict={setSelectedDistrict}
                        handleLocationSearch={handleLocationSearch}
                        isSearchingLocation={isSearchingLocation}
                        searchCoords={searchCoords}
                        userCoords={userCoords}
                        setSearchCoords={setSearchCoords}
                        fetchNearestBranch={fetchNearestBranch}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Legend - Hide on mobile if filter is open to save space */}
              <AnimatePresence>
                {(!isFilterOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                   <MapLegend userCoords={userCoords} nearestBranch={nearestBranch} />
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedStore && (
                <StoreInfoModal selectedStore={selectedStore} onClose={() => setSelectedStore(null)} />
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
