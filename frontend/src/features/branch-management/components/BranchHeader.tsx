import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface BranchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onAddEmployeeClick: () => void;
}

export const BranchHeader: React.FC<BranchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  onAddEmployeeClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-sm">
      <div className="relative w-full md:w-96">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by store name, city or province..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/50 border-slate-200 focus:ring-emerald-500 rounded-xl"
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button
          onClick={onAddEmployeeClick}
          variant="outline"
          className="flex-1 md:flex-none border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Employee
        </Button>
        <Button
          onClick={onAddClick}
          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Branch
        </Button>
      </div>
    </div>
  );
};
