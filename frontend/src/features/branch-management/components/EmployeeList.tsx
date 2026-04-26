"use client";

import React from "react";
import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { EmployeeCard } from "./EmployeeCard";
import { Employee } from "../types/branch-admin.types";

interface EmployeeListProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRemoveEmployee?: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  onRemoveEmployee,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-emerald-600" />
          Branch Employees
        </h3>
        <div className="relative w-full sm:w-72 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-500 text-slate-400">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
          <Input 
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-12 bg-white border-slate-200 focus:ring-emerald-500/10 rounded-2xl font-bold text-sm shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <EmployeeCard 
              key={emp.id} 
              employee={emp} 
              onRemove={onRemoveEmployee}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-200/60 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <UsersIcon className="w-10 h-10" />
            </div>
            <p className="text-slate-600 font-black text-lg">No employees found.</p>
            <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your search or add a new staff member.</p>
          </div>
        )}
      </div>
    </div>
  );
};
