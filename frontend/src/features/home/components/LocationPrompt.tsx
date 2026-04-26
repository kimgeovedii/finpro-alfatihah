"use client";

import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation, AlertTriangle } from "lucide-react";
import { useNearestStore } from "../hooks/useNearestStore";

export const LocationPrompt = () => {
  const { locationStatus, nearestBranch, distance, isInRange, requestLocation } = useNearestStore();

  if (locationStatus === "granted") {
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
            Find Your Nearest Store
          </h2>
          <p className="text-sm text-muted-foreground">
            Allow location access to see products from the branch nearest to you.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={requestLocation}
            disabled={locationStatus === "requesting"}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70 text-sm whitespace-nowrap"
          >
            {locationStatus === "requesting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Allow Location Access
              </>
            )}
          </motion.button>
          
          {locationStatus === "denied" && (
            <p className="text-[10px] text-red-500 font-medium text-center md:text-left">
              Location access denied. Using default branch.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
