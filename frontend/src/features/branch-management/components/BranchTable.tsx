import React from "react";
import { Branch } from "../types/branch-admin.type";
import { BranchTableRow } from "./BranchTableRow";
import { Skeleton } from "@/components/ui/skeleton";

interface BranchTableProps {
  branches: Branch[];
  isLoading: boolean;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onManageSchedules: (branch: Branch) => void;
  onAssignAdmin: (branch: Branch) => void;
  onViewAdmins: (branch: Branch) => void;
  onSetDefault: (branch: Branch) => void;
}

export const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  isLoading,
  onEdit,
  onDelete,
  onManageSchedules,
  onAssignAdmin,
  onViewAdmins,
  onSetDefault,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <p className="text-lg font-medium">No branches found</p>
        <p className="text-sm">Try adjusting your search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
      <div className="min-w-[1000px]">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-medium w-[250px]">Store Name</th>
              <th className="py-4 px-6 font-medium">Location</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium">Admins</th>
              <th className="py-4 px-6 font-medium">Completeness</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {branches.map((branch, index) => (
              <BranchTableRow
                key={branch.id}
                branch={branch}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageSchedules={onManageSchedules}
                onAssignAdmin={onAssignAdmin}
                onViewAdmins={onViewAdmins}
                onSetDefault={onSetDefault}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

