"use client";

import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { BranchSchedule } from "../types/branch-admin.type";

interface BranchScheduleCardProps {
  schedules: BranchSchedule[];
}

export const BranchScheduleCard: React.FC<BranchScheduleCardProps> = ({ schedules }) => {
  return (
    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
        Operating Hours
      </h3>
      
      <div className="space-y-2">
        {schedules.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-white hover:shadow-sm transition-all duration-300">
            <span className="text-xs font-extrabold text-slate-500 w-12">{s.dayName}</span>
            <span className={cn(
              "text-xs font-bold transition-colors",
              s.startTime ? "text-slate-800 group-hover:text-emerald-600" : "text-slate-300 italic font-medium"
            )}>
              {s.startTime ? `${s.startTime} - ${s.endTime}` : "Closed"}
            </span>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
             <CalendarDaysIcon className="w-10 h-10 mb-2 text-slate-400" />
             <p className="text-xs text-slate-500 font-bold italic">No schedules set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
