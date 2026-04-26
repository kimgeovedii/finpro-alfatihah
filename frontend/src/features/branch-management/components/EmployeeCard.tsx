"use client";

import React from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Employee } from "../types/branch-admin.types";

interface EmployeeCardProps {
  employee: Employee;
  onRemove?: (id: string) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onRemove }) => {
  const initials = employee.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-[28px] hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors leading-tight">
            {employee.fullName}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-400 font-medium mt-0.5">
            <EnvelopeIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{employee.user?.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <span
          className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none",
            employee.role === "SUPER_ADMIN"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          )}
        >
          {employee.role.replace("_", " ")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove?.(employee.id)}
          className="h-8 px-3 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
