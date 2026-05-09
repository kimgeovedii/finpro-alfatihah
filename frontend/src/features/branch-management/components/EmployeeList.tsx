"use client";

import React from "react";
import { MagnifyingGlassIcon, UsersIcon, FunnelIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeCard } from "./EmployeeCard";
import { Employee, PaginationMeta } from "../types/branch-admin.type";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EmployeeListProps {
  employees: Employee[];
  meta: PaginationMeta;
  searchQuery: string;
  filter: "all" | "unassigned";
  hideFilter?: boolean;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: "all" | "unassigned") => void;
  onPageChange: (page: number) => void;
  onRemoveEmployee?: (id: string) => void;
  onAssignClick?: (employee: Employee) => void;
  onAddEmployee?: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  meta,
  searchQuery,
  filter,
  hideFilter = false,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onRemoveEmployee,
  onAssignClick,
  onAddEmployee,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full md:w-96 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-500 text-slate-400">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </div>
            <Input 
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11 h-12 bg-white/50 border-slate-200 focus:ring-emerald-500 rounded-xl font-bold text-sm shadow-sm transition-all"
            />
          </div>
          
          {!hideFilter && (
            <Button
              variant={filter === "unassigned" ? "default" : "outline"}
              onClick={() => onFilterChange(filter === "all" ? "unassigned" : "all")}
              className={cn(
                "h-12 rounded-xl gap-2 shadow-sm font-bold",
                filter === "unassigned" 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              <FunnelIcon className="w-4 h-4" />
              {filter === "all" ? "Unassigned Only" : "Show All"}
            </Button>
          )}
        </div>

        {onAddEmployee && (
          <Button
            onClick={onAddEmployee}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2 h-12"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add Employee
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <EmployeeCard 
              key={emp.id} 
              employee={emp} 
              onRemove={onRemoveEmployee}
              onAssignClick={onAssignClick}
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

      {meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (meta.page > 1) onPageChange(meta.page - 1);
                }}
                className={meta.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                  isActive={meta.page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (meta.page < meta.totalPages) onPageChange(meta.page + 1);
                }}
                className={meta.page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
