import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DocumentChartBarIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { ReportHeaderProps } from "../types/report.type";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  month,
  year,
  branchId,
  branches,
  isStoreAdmin,
  onMonthChange,
  onYearChange,
  onBranchChange,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-[#2c2f30] tracking-tight">
            Dashboard
          </h1>
          <p className="text-[#595c5d] max-w-xl leading-relaxed text-sm md:text-base font-medium opacity-80">
            Track your grocery store&apos;s performance with comprehensive sales
            and inventory insights. Analyze trends, monitor stock levels, and
            optimize your operations.
          </p>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col gap-4 min-w-[360px]">
          {/* Row 1: Store Selection */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl shrink-0 w-10 h-10 flex items-center justify-center">
              <BuildingStorefrontIcon className="w-5 h-5 text-[#595c5d]" />
            </div>
            <div className="flex flex-col grow">
              <span className="text-[10px] font-bold text-[#a0a3a3] uppercase tracking-wider mb-0.5">
                Select Store
              </span>
              <Select
                value={branchId}
                onValueChange={onBranchChange}
                disabled={isStoreAdmin}
              >
                <SelectTrigger className="border-none shadow-none p-0 h-auto text-sm font-bold text-[#2c2f30] focus:ring-0 disabled:opacity-100 bg-transparent flex justify-between items-center w-full">
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-2xl rounded-2xl p-1">
                  {!isStoreAdmin && (
                    <SelectItem value="all" className="rounded-xl font-medium">
                      All Stores
                    </SelectItem>
                  )}
                  {branches.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="rounded-xl font-medium"
                    >
                      {b.storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Row 2: Date Selection */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl shrink-0 w-10 h-10 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[#595c5d]" />
            </div>
            <div className="flex gap-12 grow">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#a0a3a3] uppercase tracking-wider mb-0.5">
                  Month
                </span>
                <Select
                  value={month.toString()}
                  onValueChange={(val) => onMonthChange(parseInt(val))}
                >
                  <SelectTrigger className="border-none shadow-none p-0 h-auto text-sm font-bold text-[#2c2f30] focus:ring-0 bg-transparent min-w-[90px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="border-none shadow-2xl rounded-2xl p-1">
                    {months.map((m, i) => (
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString()}
                        className="rounded-xl font-medium"
                      >
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#a0a3a3] uppercase tracking-wider mb-0.5">
                  Year
                </span>
                <Select
                  value={year.toString()}
                  onValueChange={(val) => onYearChange(parseInt(val))}
                >
                  <SelectTrigger className="border-none shadow-none p-0 h-auto text-sm font-bold text-[#2c2f30] focus:ring-0 bg-transparent min-w-[70px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="border-none shadow-2xl rounded-2xl p-1">
                    {years.map((y) => (
                      <SelectItem
                        key={y}
                        value={y.toString()}
                        className="rounded-xl font-medium"
                      >
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
