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
import { EmployeeList } from "./EmployeeList";
import { AssignEmployeeDialog } from "./AssignEmployeeDialog";
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
    employeeMeta,
    employeeFilter,
    handleEmployeePageChange,
    handleEmployeeFilterChange,
    assignEmployeeDialogOpen,
    setAssignEmployeeDialogOpen,
    selectedEmployee,
    handleAssignEmployeeClick,
    handleAssignEmployeeSubmit,
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
        <div className="flex items-center gap-2 p-1 bg-[#eff1f2] rounded-xl w-fit overflow-x-auto no-scrollbar max-w-full border border-[#eff1f2]">
            <button
                onClick={() => setActiveTab("branches")}
                className={cn(
                    "flex items-center gap-2 px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all",
                    activeTab === "branches" 
                        ? "bg-white shadow-sm text-[#006666]" 
                        : "text-[#595c5d] hover:text-[#2c2f30]"
                )}
            >
                <BuildingStorefrontIcon className="w-4 h-4" />
                Branches
            </button>
            <button
                onClick={() => setActiveTab("employees")}
                className={cn(
                    "flex items-center gap-2 px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all",
                    activeTab === "employees" 
                        ? "bg-white shadow-sm text-[#006666]" 
                        : "text-[#595c5d] hover:text-[#2c2f30]"
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
        <EmployeeList
          employees={employees}
          meta={employeeMeta}
          searchQuery={searchQuery}
          filter={employeeFilter}
          onSearchChange={handleSearchChange}
          onFilterChange={handleEmployeeFilterChange}
          onPageChange={handleEmployeePageChange}
          onAddEmployee={handleAddEmployee}
          onAssignClick={handleAssignEmployeeClick}
        />
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

      <AssignEmployeeDialog
        open={assignEmployeeDialogOpen}
        onOpenChange={setAssignEmployeeDialogOpen}
        employee={selectedEmployee}
        branches={branches}
        isSubmitting={isSubmitting}
        onAssign={handleAssignEmployeeSubmit}
      />
    </div>
  );
};
