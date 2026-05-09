import { useCallback, useRef, useEffect } from "react";
import { useBranchAdminStore } from "../service/branch-admin.service";
import {
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  Employee,
} from "../types/branch-admin.type";
import { toast } from "sonner";


export const useBranchManagement = () => {
  // ── Subscribe only to STATE slices (no actions) to avoid infinite re-renders ──
  const branches = useBranchAdminStore((s) => s.branches);
  const meta = useBranchAdminStore((s) => s.meta);
  const selectedBranch = useBranchAdminStore((s) => s.selectedBranch);
  const isLoading = useBranchAdminStore((s) => s.isLoading);
  const isSubmitting = useBranchAdminStore((s) => s.isSubmitting);
  const isDeleting = useBranchAdminStore((s) => s.isDeleting);

  const employees = useBranchAdminStore((s) => s.employees);
  const employeeMeta = useBranchAdminStore((s) => s.employeeMeta);
  const employeeFilter = useBranchAdminStore((s) => s.employeeFilter);
  const availableAdmins = useBranchAdminStore((s) => s.availableAdmins);
  const selectedEmployee = useBranchAdminStore((s) => s.selectedEmployee);
  const isLoadingEmployees = useBranchAdminStore((s) => s.isLoadingEmployees);

  const currentSchedules = useBranchAdminStore((s) => s.currentSchedules);
  const isLoadingSchedules = useBranchAdminStore((s) => s.isLoadingSchedules);

  const searchQuery = useBranchAdminStore((s) => s.searchQuery);
  const debouncedSearch = useBranchAdminStore((s) => s.debouncedSearch);

  const branchDialogOpen = useBranchAdminStore((s) => s.branchDialogOpen);
  const deleteDialogOpen = useBranchAdminStore((s) => s.deleteDialogOpen);
  const scheduleDialogOpen = useBranchAdminStore((s) => s.scheduleDialogOpen);
  const assignAdminDialogOpen = useBranchAdminStore((s) => s.assignAdminDialogOpen);
  const viewAdminsDialogOpen = useBranchAdminStore((s) => s.viewAdminsDialogOpen);
  const employeeDialogOpen = useBranchAdminStore((s) => s.employeeDialogOpen);
  const assignEmployeeDialogOpen = useBranchAdminStore((s) => s.assignEmployeeDialogOpen);
  const setDefaultDialogOpen = useBranchAdminStore((s) => s.setDefaultDialogOpen);

  // ── Stable action references (never change) ──
  const actions = useBranchAdminStore.getState;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search with debounce ──
  const handleSearchChange = useCallback((value: string) => {
    const s = actions();
    s.setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      actions().setDebouncedSearch(value);
    }, 400);
  }, [actions]);

  // ── Fetch helpers (stable — no reactive deps) ──
  const fetchBranches = useCallback(async (page: number = 1) => {
    try {
      await actions().fetchBranches(page);
    } catch {
      toast.error("Failed to load branches");
    }
  }, [actions]);

  const fetchBranchDetail = useCallback(async (id: string) => {
    try {
      return await actions().fetchBranchDetail(id);
    } catch {
      toast.error("Failed to load branch details");
      return null;
    }
  }, [actions]);

  const fetchAvailableAdmins = useCallback(async () => {
    await actions().fetchAvailableAdmins();
  }, [actions]);

  const fetchSchedules = useCallback(async (branchId: string) => {
    try {
      await actions().fetchSchedules(branchId);
    } catch {
      toast.error("Failed to load schedules");
    }
  }, [actions]);

  const fetchEmployees = useCallback(async (params?: { search?: string; branchId?: string; page?: number; limit?: number }) => {
    await actions().fetchEmployees(params);
  }, [actions]);

  // ── UI handlers ──
  const handlePageChange = useCallback((page: number) => {
    fetchBranches(page);
  }, [fetchBranches]);

  const handleAddBranch = useCallback(() => {
    actions().setSelectedBranch(null);
    actions().setBranchDialogOpen(true);
  }, [actions]);

  const handleEditBranch = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    actions().setBranchDialogOpen(true);
  }, [actions]);

  const handleDeleteClick = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    actions().setDeleteDialogOpen(true);
  }, [actions]);

  const handleManageSchedules = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    fetchSchedules(branch.id);
    actions().setScheduleDialogOpen(true);
  }, [actions, fetchSchedules]);

  const handleAssignAdminClick = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    actions().setAssignAdminDialogOpen(true);
  }, [actions]);

  const handleViewAdmins = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    actions().setViewAdminsDialogOpen(true);
  }, [actions]);

  const handleBranchSubmit = useCallback(async (values: CreateBranchPayload | UpdateBranchPayload) => {
    const s = actions();
    try {
      if (s.selectedBranch) {
        await s.updateBranch(s.selectedBranch.id, values);
        toast.success("Branch updated");
      } else {
        await s.createBranch(values as CreateBranchPayload);
        toast.success("Branch created");
      }
      s.setBranchDialogOpen(false);
      fetchBranches(s.meta.page);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
      throw err;
    }
  }, [actions, fetchBranches]);

  const handleDeleteConfirm = useCallback(async () => {
    const s = actions();
    if (!s.selectedBranch) return;
    try {
      await s.deleteBranch(s.selectedBranch.id);
      toast.success("Branch deleted");
      s.setDeleteDialogOpen(false);
      fetchBranches(s.meta.page);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }, [actions, fetchBranches]);

  const handleScheduleSubmit = useCallback(async (values: CreateSchedulePayload | UpdateSchedulePayload) => {
    const s = actions();
    const targetBranchId = s.selectedBranch?.id;
    if (!targetBranchId) return;

    try {
      if ((values as any).id && !(values as any).id.startsWith("placeholder")) {
        await s.updateSchedule((values as any).id, values as UpdateSchedulePayload);
      } else {
        await s.createSchedule(targetBranchId, values as CreateSchedulePayload);
      }
      toast.success("Schedule updated");
      fetchSchedules(targetBranchId);
    } catch (err: any) {
      toast.error(err.message || "Failed to update schedule");
    }
  }, [actions, fetchSchedules]);

  const handleDeleteSchedule = useCallback(async (scheduleId: string) => {
    const s = actions();
    const targetBranchId = s.selectedBranch?.id;
    if (!targetBranchId) return;

    try {
      await s.deleteSchedule(scheduleId);
      toast.success("Schedule removed");
      fetchSchedules(targetBranchId);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove schedule");
    }
  }, [actions, fetchSchedules]);

  const handleAddEmployee = useCallback(() => {
    actions().setEmployeeDialogOpen(true);
  }, [actions]);

  const handleEmployeeSubmit = useCallback(async (values: any) => {
    const s = actions();
    try {
      await s.createEmployee(values);
      toast.success("Employee created successfully");
      s.setEmployeeDialogOpen(false);

      if (values.branchId && values.branchId !== "none") {
        fetchEmployees({ branchId: values.branchId });
      } else {
        fetchEmployees();
      }

      fetchAvailableAdmins();
    } catch (err: any) {
      toast.error(err.message || "Failed to create employee");
    }
  }, [actions, fetchEmployees, fetchAvailableAdmins]);

  const handleAssignAdmin = useCallback(async (employeeId: string) => {
    const s = actions();
    if (!s.selectedBranch) return;
    try {
      await s.assignAdmin(s.selectedBranch.id, employeeId);
      toast.success("Admin assigned");
      fetchBranches(s.meta.page);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign admin");
    }
  }, [actions, fetchBranches]);

  const handleEmployeePageChange = useCallback((page: number) => {
    fetchEmployees({ page });
  }, [fetchEmployees]);

  const handleEmployeeFilterChange = useCallback((filter: "all" | "unassigned") => {
    const s = actions();
    s.setEmployeeFilter(filter);
    s.setEmployeeMeta({ ...s.employeeMeta, page: 1 });
  }, [actions]);

  const handleAssignEmployeeClick = useCallback((employee: Employee) => {
    actions().setSelectedEmployee(employee);
    actions().setAssignEmployeeDialogOpen(true);
  }, [actions]);

  const handleAssignEmployeeSubmit = useCallback(async (branchId: string) => {
    const s = actions();
    if (!s.selectedEmployee) return;
    try {
      await s.assignAdmin(branchId, s.selectedEmployee.id);
      toast.success("Employee assigned to branch successfully");
      s.setAssignEmployeeDialogOpen(false);
      fetchEmployees();
      fetchBranches(s.meta.page);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign employee");
    }
  }, [actions, fetchEmployees, fetchBranches]);

  const handleRemoveEmployee = useCallback(async (employeeId: string) => {
    const s = actions();
    try {
      await s.unassignEmployee(employeeId);
      toast.success("Employee removed from branch");
      fetchEmployees({ branchId: s.selectedBranch?.id });
    } catch (err: any) {
      toast.error(err.message || "Failed to remove employee");
    }
  }, [actions, fetchEmployees]);

  const handleSetDefaultClick = useCallback((branch: Branch) => {
    actions().setSelectedBranch(branch);
    actions().setSetDefaultDialogOpen(true);
  }, [actions]);

  const handleSetDefaultConfirm = useCallback(async () => {
    const s = actions();
    if (!s.selectedBranch) return;
    try {
      await s.setDefaultBranch(s.selectedBranch.id);
      toast.success(`${s.selectedBranch.storeName} set as default branch`);
      s.setSetDefaultDialogOpen(false);
      fetchBranches(s.meta.page);
    } catch (err: any) {
      s.setSetDefaultDialogOpen(false);
      toast.error(err.message || "Failed to set default branch");
    }
  }, [actions, fetchBranches]);

  return {
    // State
    branches,
    meta,
    isLoading,
    searchQuery,
    debouncedSearch,
    selectedBranch,
    isSubmitting,
    isDeleting,
    availableAdmins,
    employees,
    isLoadingEmployees,
    currentSchedules,
    isLoadingSchedules,
    employeeMeta,
    employeeFilter,
    selectedEmployee,

    // Dialog states
    branchDialogOpen,
    setBranchDialogOpen: actions().setBranchDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen: actions().setDeleteDialogOpen,
    scheduleDialogOpen,
    setScheduleDialogOpen: actions().setScheduleDialogOpen,
    assignAdminDialogOpen,
    setAssignAdminDialogOpen: actions().setAssignAdminDialogOpen,
    viewAdminsDialogOpen,
    setViewAdminsDialogOpen: actions().setViewAdminsDialogOpen,
    employeeDialogOpen,
    setEmployeeDialogOpen: actions().setEmployeeDialogOpen,
    assignEmployeeDialogOpen,
    setAssignEmployeeDialogOpen: actions().setAssignEmployeeDialogOpen,
    setSelectedBranch: actions().setSelectedBranch,
    setSelectedEmployee: actions().setSelectedEmployee,
    setDefaultDialogOpen,
    setSetDefaultDialogOpen: actions().setSetDefaultDialogOpen,

    // Actions
    fetchBranches,
    fetchBranchDetail,
    fetchAvailableAdmins,
    fetchEmployees,
    handleSearchChange,
    handlePageChange,
    handleAddBranch,
    handleEditBranch,
    handleDeleteClick,
    handleManageSchedules,
    handleAssignAdminClick,
    handleViewAdmins,
    handleBranchSubmit,
    handleDeleteConfirm,
    handleScheduleSubmit,
    handleDeleteSchedule,
    handleAddEmployee,
    handleEmployeeSubmit,
    handleAssignAdmin,
    handleEmployeePageChange,
    handleEmployeeFilterChange,
    handleAssignEmployeeClick,
    handleAssignEmployeeSubmit,
    handleRemoveEmployee,
    handleSetDefaultClick,
    handleSetDefaultConfirm,
  };
};
