import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Branch } from "../types/branch-admin.types";
import { Button } from "@/components/ui/button";
import { 
  PencilIcon, 
  TrashIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BranchTableRowProps {
  branch: Branch;
  index: number;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onManageSchedules: (branch: Branch) => void;
  onAssignAdmin: (branch: Branch) => void;
  onViewAdmins: (branch: Branch) => void;
}

export const BranchTableRow: React.FC<BranchTableRowProps> = ({
  branch,
  index,
  onEdit,
  onDelete,
  onManageSchedules,
  onAssignAdmin,
  onViewAdmins,
}) => {
  const router = useRouter();

  return (
    <TableRow className="group hover:bg-slate-50/50 transition-colors">
      <TableCell className="font-medium text-slate-900">
        <div className="flex flex-col">
          <span>{branch.storeName}</span>
          <span className="text-xs text-slate-500 font-normal">{branch.id.slice(0, 8)}...</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPinIcon className="w-4 h-4 text-emerald-500" />
          <span>{branch.city}, {branch.province}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={branch.isActive ? "default" : "secondary"} className={branch.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100" : ""}>
          {branch.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell 
        className="cursor-pointer hover:bg-slate-100/50 transition-colors" 
        onClick={() => router.push(`/dashboard/branches/${branch.id}`)}
      >
        <div className="flex items-center gap-3">
          {branch.employees && branch.employees.length > 0 ? (
            <>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 ring-2 ring-white">
                {branch.employees[0].user?.avatar ? (
                  <img 
                    src={branch.employees[0].user.avatar} 
                    alt={branch.employees[0].fullName} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  branch.employees[0].fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <span className="text-sm font-medium text-slate-600">
                {branch.employees.length} {branch.employees.length === 1 ? "Admin" : "Admins"}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 opacity-40" />
              </div>
              <span className="text-xs italic">No admin</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {/* Admin status */}
          <div className="relative">
            <div 
              className={`flex items-center justify-center h-8 w-8 rounded-lg ${branch.employees && branch.employees.length > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}
              title={branch.employees && branch.employees.length > 0 ? "Admin Assigned" : "No Admin Assigned"}
            >
              <UserGroupIcon className="w-4 h-4" />
            </div>
            {(!branch.employees || branch.employees.length === 0) && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                <XMarkIcon className="w-2 h-2 stroke-[4px]" />
              </div>
            )}
          </div>
          
          {/* Schedule status */}
          <div className="relative">
            <div 
              className={`flex items-center justify-center h-8 w-8 rounded-lg ${branch.schedules && branch.schedules.length > 0 ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}
              title={branch.schedules && branch.schedules.length > 0 ? "Schedules Set" : "Schedules Not Set"}
            >
              <ClockIcon className="w-4 h-4" />
            </div>
            {(!branch.schedules || branch.schedules.length === 0) && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                <XMarkIcon className="w-2 h-2 stroke-[4px]" />
              </div>
            )}
          </div>

          {/* Location status */}
          <div className="relative">
            <div 
              className={`flex items-center justify-center h-8 w-8 rounded-lg ${branch.latitude && branch.longitude ? "bg-purple-50 text-purple-600" : "bg-slate-50 text-slate-400"}`}
              title={branch.latitude && branch.longitude ? "Map Position Set" : "Map Position Missing"}
            >
              <MapPinIcon className="w-4 h-4" />
            </div>
            {(!branch.latitude || !branch.longitude) && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                <XMarkIcon className="w-2 h-2 stroke-[4px]" />
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/dashboard/branches/${branch.id}`}>
            <Button
              variant="ghost"
              size="icon"
              title="View Details & Employees"
              className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8"
            >
              <UserGroupIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(branch)}
            title="Delete Branch"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
