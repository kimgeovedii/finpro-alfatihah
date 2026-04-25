import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Branch } from "../types/branch-admin.types";
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
}

export const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  isLoading,
  onEdit,
  onDelete,
  onManageSchedules,
  onAssignAdmin,
  onViewAdmins,
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
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[250px]">Store Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admins</TableHead>
            <TableHead>Completeness</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
