import { useState } from "react";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BranchData } from "@/features/home/types/home.types";
import dynamic from "next/dynamic";

const BranchMiniMap = dynamic(
  () => import("./BranchMiniMap").then((mod) => mod.BranchMiniMap),
  { ssr: false, loading: () => <div className="w-full h-40 bg-slate-100 animate-pulse rounded-2xl" /> }
);

interface BranchSidebarProps {
  branch: BranchData;
}

export const BranchSidebar = ({ branch }: BranchSidebarProps) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Location Card */}
      <div className="glass-panel bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/40 dark:border-slate-800/50 shadow-sm sticky top-24">
        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          Branch Info
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Address</p>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm md:text-base">
              {branch.address}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Location</p>
              <BranchMiniMap 
                lat={branch.latitude} 
                lng={branch.longitude} 
                storeName={branch.storeName} 
              />
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10">
              <p className="text-xs md:text-sm text-center font-bold text-slate-700 dark:text-slate-200">
                Max Delivery <span className="text-primary">{branch.maxDeliveryDistance} KM</span>
              </p>
            </div>
          </div>

          {branch.schedules && branch.schedules.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <button 
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                className="w-full text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center justify-between group/btn"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  Schedule
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isScheduleOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-3">
                      {branch.schedules.map((schedule, idx) => (
                        <div key={idx} className="flex justify-between items-center px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/30 group/sched hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{schedule.dayName}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
