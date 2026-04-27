"use client";

import React from "react";
import { BuildingStorefrontIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface BranchInfoCardProps {
  address: string;
  city: string;
  province: string;
  district?: string;
  village?: string;
  maxDeliveryDistance: number;
  isActive: boolean;
}

export const BranchInfoCard: React.FC<BranchInfoCardProps> = ({
  address,
  city,
  province,
  district,
  village,
  maxDeliveryDistance,
  isActive,
}) => {
  return (
    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <BuildingStorefrontIcon className="w-5 h-5 text-emerald-600" />
        Store Information
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-colors">
          <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Full Address</p>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">District</p>
            <p className="text-sm font-bold text-slate-700 truncate">{district || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Village</p>
            <p className="text-sm font-bold text-slate-700 truncate">{village || '-'}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Max Delivery</p>
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-slate-700">{maxDeliveryDistance}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase">KM</span>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          )}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  );
};
