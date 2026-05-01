import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { CalendarDays, MapPin } from "lucide-react";
import React, { useState } from "react";
import { BranchDetail } from "../types/product.type";
import { formatListSchedule } from "@/utils/converter.util";

type Props = {
  branch: BranchDetail;
};

export const ProductBranchInfoCard: React.FC<Props> = ({ branch }) => {
  const scheduleText = branch?.schedules
    ? formatListSchedule(branch?.schedules)
    : "-";

  return (
    <div
      className="relative rounded-3xl mt-3 overflow-hidden p-4 flex flex-col gap-4"
      style={{
        background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="relative flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          <BuildingOfficeIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-white text-lg font-bold mb-0">
            {branch.storeName}
          </p>
          <div className="inline-block text-[11px] font-semibold bg-green-600 px-2 py-0.5 rounded-md">
            <p className="text-white text-xs">Closed</p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3 text-white/80 text-sm">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{branch.address}</span>
        </div>
        <div className="flex items-center gap-3 text-white/80 text-xs">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{scheduleText}</span>
        </div>
      </div>
    </div>
  );
};
