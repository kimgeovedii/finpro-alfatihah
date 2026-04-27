import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentChartBarIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface ReportHeaderProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const ReportHeader: React.FC<ReportHeaderProps> = ({ month, year, onMonthChange, onYearChange }) => {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2f30] tracking-tight mb-1">Reports & Analysis</h1>
          <p className="text-[#595c5d] max-w-2xl leading-relaxed">
            Track your grocery store&apos;s performance with comprehensive sales and inventory insights. 
            Analyze trends, monitor stock levels, and optimize your operations.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <CalendarIcon className="w-4 h-4 text-[#595c5d]" />
            <span className="text-xs font-semibold text-[#595c5d] uppercase tracking-wider">Report Period:</span>
          </div>
          <Select value={month.toString()} onValueChange={(val) => onMonthChange(parseInt(val))}>
            <SelectTrigger className="w-[130px] bg-white border-none shadow-sm rounded-lg h-9 text-sm font-medium focus:ring-0">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="border-none shadow-xl">
              {months.map((m, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(val) => onYearChange(parseInt(val))}>
            <SelectTrigger className="w-[90px] bg-white border-none shadow-sm rounded-lg h-9 text-sm font-medium focus:ring-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="border-none shadow-xl">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
