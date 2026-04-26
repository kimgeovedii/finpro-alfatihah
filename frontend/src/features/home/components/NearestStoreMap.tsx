"use client";

import { useState, useMemo } from "react";
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

interface StoreDetail {
  name: string;
  address: string;
  distance: string;
}

interface NearestStoreMapProps {
  branches: BranchData[];
  userCoords: { lat: number; lng: number } | null;
  nearestBranch: BranchData | null;
}

export const NearestStoreMap = ({ branches, userCoords, nearestBranch }: NearestStoreMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);

  const LeafletMapContent = useMemo(
    () =>
      dynamic(
        () =>
          import("@/components/common/LeafletMapContent").then((mod) => mod.LeafletMapContent),
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

  const handleShowStore = (name: string, address: string, distance: string) => {
    setSelectedStore({ name, address, distance });
  };

  return (
    <section className="transition-all duration-500 ease-in-out mb-8">
      {!isExpanded ? (
        <motion.div
          layoutId="map-container"
          className="glass-panel rounded-full px-8 py-5 flex items-center justify-between shadow-sm border border-primary/10 cursor-pointer hover:bg-white/60 transition-colors"
          onClick={() => setIsExpanded(true)}
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
            />

            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-[1000] pointer-events-none">
              <div className="glass-panel p-4 rounded-2xl flex items-center gap-6 shadow-xl pointer-events-auto">
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
