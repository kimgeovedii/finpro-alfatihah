"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBranchManagement } from "../hooks/useBranchManagement";
import { Button } from "@/components/ui/button";
import { 
  BuildingStorefrontIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { BranchScheduleDialog } from "./BranchScheduleDialog";
import { BranchFormDialog } from "./BranchFormDialog";
import { BranchDetailHeader } from "./BranchDetailHeader";
import { BranchInfoCard } from "./BranchInfoCard";
import { BranchScheduleCard } from "./BranchScheduleCard";
import { EmployeeList } from "./EmployeeList";

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
            <p className="text-slate-500 font-bold animate-pulse tracking-tight">Loading store intelligence...</p>
        </div>
    );
  }

  if (!branch) return (
    <div className="p-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
        <BuildingStorefrontIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Store Not Found</h2>
        <p className="text-slate-400 font-medium mt-2">The store you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/dashboard/stores")} className="mt-8 rounded-2xl bg-slate-900">Return to Store List</Button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 max-w-7xl mx-auto">
      <BranchDetailHeader 
        storeName={branch.storeName}
        city={branch.city}
        province={branch.province}
        totalStaff={employees.length}
        onAddStaff={() => setEmployeeDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Left: Store Intelligence */}
        <div className="lg:col-span-4 space-y-8">
            <BranchInfoCard 
                address={branch.address}
                city={branch.city}
                province={branch.province}
                district={branch.district}
                village={branch.village}
                maxDeliveryDistance={branch.maxDeliveryDistance}
                isActive={branch.isActive}
            />

            <BranchScheduleCard schedules={schedules} />

            <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                <h4 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                    <ClockIcon className="w-5 h-5 text-emerald-400" />
                    Quick Actions
                </h4>
                <div className="grid grid-cols-1 gap-3 relative z-10">
                    <Button 
                        onClick={() => setScheduleDialogOpen(true)}
                        className="justify-start h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all hover:translate-x-1"
                    >
                        Manage Schedules
                    </Button>
                    <Button 
                        onClick={() => setBranchDialogOpen(true)}
                        className="justify-start h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all hover:translate-x-1"
                    >
                        Update Store Details
                    </Button>
                </div>
            </div>
        </div>

        {/* Right: Workforce Management */}
        <div className="lg:col-span-8">
            <EmployeeList 
                employees={employees}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onRemoveEmployee={(id) => {
                    // TODO: Implement remove logic if needed
                    console.log("Remove employee:", id);
                }}
            />
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
