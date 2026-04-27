"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeftIcon, 
  BuildingStorefrontIcon, 
  MapPinIcon, 
  UserPlusIcon 
} from "@heroicons/react/24/outline";

interface BranchDetailHeaderProps {
  storeName: string;
  city: string;
  province: string;
  totalStaff: number;
  onAddStaff: () => void;
}

export const BranchDetailHeader: React.FC<BranchDetailHeaderProps> = ({
  storeName,
  city,
  province,
  totalStaff,
  onAddStaff,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors w-fit font-bold text-sm group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Store List
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[28px] bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200/50 flex-shrink-0">
            <BuildingStorefrontIcon className="w-8 h-8 md:w-10 md:w-10" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight truncate">{storeName}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium text-sm md:text-base">
              <MapPinIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{city}, {province}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
           <div className="bg-white border border-slate-200 px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-sm text-center hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-tight">Total Staff</p>
              <p className="text-lg md:text-xl font-extrabold text-slate-800 leading-tight">{totalStaff}</p>
           </div>
           <Button 
              onClick={onAddStaff}
              className="h-12 md:h-14 px-6 md:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200/50 transition-all flex items-center gap-2"
           >
              <UserPlusIcon className="w-5 h-5" />
              <span className="hidden xs:inline">Add Staff Member</span>
              <span className="xs:hidden">Add Staff</span>
           </Button>
        </div>
      </div>
    </div>
  );
};
