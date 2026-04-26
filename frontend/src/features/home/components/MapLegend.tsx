"use client";

import { motion } from "framer-motion";
import { BranchData } from "../types/home.types";

interface MapLegendProps {
  userCoords: { lat: number; lng: number } | null;
  nearestBranch: BranchData | null;
}

export const MapLegend = ({ userCoords, nearestBranch }: MapLegendProps) => (
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
);
