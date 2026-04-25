"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBranchManagement } from "../hooks/useBranchManagement";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  EnvelopeIcon,
  UsersIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { BranchScheduleDialog } from "./BranchScheduleDialog";
import { BranchFormDialog } from "./BranchFormDialog";

export const BranchDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const {
    selectedBranch: branch,
    employees,
    currentSchedules: schedules,
    isLoading,
    isLoadingSchedules,
    isSubmitting,
    employeeDialogOpen,
    setEmployeeDialogOpen,
    scheduleDialogOpen,
    setScheduleDialogOpen,
    branchDialogOpen,
    setBranchDialogOpen,
    handleEmployeeSubmit,
    handleBranchSubmit,
    handleScheduleSubmit,
    handleDeleteSchedule,
    fetchBranchDetail,
    fetchEmployees,
    debouncedSearch,
    handleSearchChange,
    searchQuery
  } = useBranchManagement();

  useEffect(() => {
    if (id) {
      fetchBranchDetail(id as string);
    }
  }, [id, fetchBranchDetail]);

  useEffect(() => {
    if (id) {
      fetchEmployees({ branchId: id as string, search: debouncedSearch });
    }
  }, [id, debouncedSearch, fetchEmployees]);

  if (isLoading && !branch) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading branch details...</p>
        </div>
    );
  }

  if (!branch) return <div className="p-8 text-center">Branch not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit font-bold text-sm group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Store List
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-[28px] bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
              <BuildingStorefrontIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{branch.storeName}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
                <MapPinIcon className="w-4 h-4 text-emerald-500" />
                {branch.city}, {branch.province}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Staff</p>
                <p className="text-xl font-extrabold text-slate-800">{employees.length}</p>
             </div>
             <Button 
                onClick={() => setEmployeeDialogOpen(true)}
                className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200/50 transition-all flex items-center gap-2"
             >
                <UserPlusIcon className="w-5 h-5" />
                Add Staff Member
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Branch Info */}
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BuildingStorefrontIcon className="w-5 h-5 text-emerald-600" />
                    Store Information
                </h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Full Address</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{branch.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">District</p>
                            <p className="text-sm font-bold text-slate-700">{branch.district || '-'}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Village</p>
                            <p className="text-sm font-bold text-slate-700">{branch.village || '-'}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-extrabold text-slate-400 mb-1">Max Delivery</p>
                            <p className="text-sm font-bold text-slate-700">{branch.maxDeliveryDistance} KM</p>
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            branch.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                            {branch.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                    Operating Hours
                </h3>
                
                <div className="space-y-2">
                    {schedules.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold">
                            <span className="text-slate-500 w-12">{s.dayName}</span>
                            <span className={cn(
                                "flex-1 text-right",
                                s.startTime ? "text-slate-800" : "text-slate-400 italic font-normal"
                            )}>
                                {s.startTime ? `${s.startTime} - ${s.endTime}` : "Closed"}
                            </span>
                        </div>
                    ))}
                    {schedules.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No schedules set yet.</p>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-emerald-400" />
                    Quick Actions
                </h4>
                <div className="grid grid-cols-1 gap-2 relative z-10">
                    <Button 
                        onClick={() => setScheduleDialogOpen(true)}
                        variant="ghost" 
                        className="justify-start h-12 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold"
                    >
                        Manage Schedules
                    </Button>
                    <Button 
                        onClick={() => setBranchDialogOpen(true)}
                        variant="ghost" 
                        className="justify-start h-12 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold"
                    >
                        Update Store Details
                    </Button>
                </div>
            </div>
        </div>

        {/* Right: Employee List */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Branch Employees</h3>
                <div className="relative w-72">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 h-11 bg-white border-slate-200 focus:ring-emerald-500/20 rounded-xl font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.length > 0 ? (
                    employees.map((emp) => (
                        <div key={emp.id} className="bg-white border border-slate-200 p-6 rounded-[28px] hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                    {emp.fullName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{emp.fullName}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <EnvelopeIcon className="w-3 h-3" />
                                        <span className="truncate">{emp.user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                                    emp.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {emp.role.replace('_', ' ')}
                                </span>
                                <Button variant="ghost" className="h-8 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                        <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold">No employees found in this branch.</p>
                        <p className="text-slate-400 text-sm">Add a new staff member to get started.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmployeeFormDialog
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        branches={branch ? [branch] : []}
        defaultBranchId={branch?.id}
        onSubmit={handleEmployeeSubmit}
        isSubmitting={isSubmitting}
      />

      <BranchScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        branch={branch}
        schedules={schedules}
        isLoading={isLoadingSchedules}
        onSubmit={handleScheduleSubmit}
        onDelete={handleDeleteSchedule}
      />

      <BranchFormDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
        branch={branch}
        onSubmit={handleBranchSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
