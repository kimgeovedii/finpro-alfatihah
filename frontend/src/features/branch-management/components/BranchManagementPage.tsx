"use client";

import React, { useState } from "react";
import { useBranchManagement } from "../hooks/useBranchManagement";
import { BranchHeader } from "./BranchHeader";
import { BranchTable } from "./BranchTable";
import { BranchFormDialog } from "./BranchFormDialog";
import { DeleteBranchDialog } from "./DeleteBranchDialog";
import { BranchScheduleDialog } from "./BranchScheduleDialog";
import { AssignAdminDialog } from "./AssignAdminDialog";
import { BranchAdminsDialog } from "./BranchAdminsDialog";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BuildingStorefrontIcon, 
  UsersIcon, 
  UserPlusIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";

export const BranchManagementPage = () => {
  const [activeTab, setActiveTab] = useState<"branches" | "employees">("branches");
  
  const {
    branches,
    meta,
    isLoading,
    searchQuery,
    branchDialogOpen,
    setBranchDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    scheduleDialogOpen,
    setScheduleDialogOpen,
    assignAdminDialogOpen,
    setAssignAdminDialogOpen,
    viewAdminsDialogOpen,
    setViewAdminsDialogOpen,
    employeeDialogOpen,
    setEmployeeDialogOpen,
    selectedBranch,
    isSubmitting,
    isDeleting,
    availableAdmins,
    employees,
    isLoadingEmployees,
    currentSchedules,
    isLoadingSchedules,
    handleSearchChange,
    handlePageChange,
    handleAddBranch,
    handleAddEmployee,
    handleEditBranch,
    handleDeleteClick,
    handleManageSchedules,
    handleAssignAdminClick,
    handleViewAdmins,
    handleBranchSubmit,
    handleEmployeeSubmit,
    handleDeleteConfirm,
    handleScheduleSubmit,
    handleDeleteSchedule,
    handleAssignAdmin,
    fetchEmployees,
    fetchBranches,
    fetchAvailableAdmins,
    debouncedSearch,
  } = useBranchManagement();

  React.useEffect(() => {
    fetchBranches(1);
    fetchAvailableAdmins();
  }, [debouncedSearch, fetchBranches, fetchAvailableAdmins]);

  React.useEffect(() => {
    if (activeTab === "employees") {
        fetchEmployees();
    }
  }, [activeTab, fetchEmployees]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Store Management
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
            Complete control over your retail network, staff assignments, and operational schedules.
            </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200/50">
            <button
                onClick={() => setActiveTab("branches")}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === "branches" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
            >
                <BuildingStorefrontIcon className="w-4 h-4" />
                Branches
            </button>
            <button
                onClick={() => setActiveTab("employees")}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === "employees" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
            >
                <UsersIcon className="w-4 h-4" />
                Employees
            </button>
        </div>
      </div>

      <div className="w-full h-px bg-slate-200/60" />

      {activeTab === "branches" ? (
        <>
            <BranchHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onAddClick={handleAddBranch}
                onAddEmployeeClick={handleAddEmployee}
            />

            <BranchTable
                branches={branches}
                isLoading={isLoading}
                onEdit={handleEditBranch}
                onDelete={handleDeleteClick}
                onManageSchedules={handleManageSchedules}
                onAssignAdmin={handleAssignAdminClick}
                onViewAdmins={handleViewAdmins}
            />

            {meta.totalPages > 1 && (
                <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                        e.preventDefault();
                        if (meta.page > 1) handlePageChange(meta.page - 1);
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
                            handlePageChange(i + 1);
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
                        if (meta.page < meta.totalPages) handlePageChange(meta.page + 1);
                        }}
                        className={meta.page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            )}
        </>
      ) : (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-sm">
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                    placeholder="Search employees by name or email..."
                    className="pl-10 bg-white/50 border-slate-200 focus:ring-emerald-500 rounded-xl"
                    />
                </div>
                <Button
                    onClick={handleAddEmployee}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2"
                >
                    <UserPlusIcon className="w-4 h-4" />
                    Add Employee
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp) => (
                    <div key={emp.id} className="bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-100 transition-colors" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-200">
                                {emp.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">{emp.fullName}</h4>
                                <p className="text-xs text-slate-500 font-medium">{emp.user?.email}</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>Role</span>
                                <span className={cn(
                                    "px-2 py-1 rounded-md text-[10px]",
                                    emp.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {emp.role.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>Assignment</span>
                                <span className="text-slate-700">
                                    {emp.branch?.storeName || "Unassigned"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Dialogs */}
      <BranchFormDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
        branch={selectedBranch}
        onSubmit={handleBranchSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteBranchDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        branch={selectedBranch}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <BranchScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        branch={selectedBranch}
        schedules={currentSchedules}
        isLoading={isLoadingSchedules}
        onSubmit={handleScheduleSubmit}
        onDelete={handleDeleteSchedule}
      />

      <AssignAdminDialog
        open={assignAdminDialogOpen}
        onOpenChange={setAssignAdminDialogOpen}
        branch={selectedBranch}
        admins={availableAdmins}
        onAssign={handleAssignAdmin}
      />

      <BranchAdminsDialog
        open={viewAdminsDialogOpen}
        onOpenChange={setViewAdminsDialogOpen}
        branch={selectedBranch}
      />

      <EmployeeFormDialog
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        branches={branches}
        onSubmit={handleEmployeeSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
