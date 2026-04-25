import { useCallback, useEffect, useRef, useState } from "react";
import {
  Branch,
  PaginationMeta,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  Employee,
  BranchSchedule,
} from "../types/branch-admin.types";
import { BranchAdminRepository } from "../repositories/branch-admin.repository";
import toast from "react-hot-toast";

const repo = new BranchAdminRepository();

export const useBranchManagement = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dialog states
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [assignAdminDialogOpen, setAssignAdminDialogOpen] = useState(false);
  const [viewAdminsDialogOpen, setViewAdminsDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [availableAdmins, setAvailableAdmins] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentSchedules, setCurrentSchedules] = useState<BranchSchedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // New Dialog State
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchBranches = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await repo.getAllBranches(
          page,
          meta.limit,
          debouncedSearch || undefined
        );

        if (response) {
          setBranches(response.branches);
          setMeta(response.meta);
        }
      } catch (err) {
        toast.error("Failed to load branches");
      } finally {
        setIsLoading(false);
      }
    },
    [meta.limit, debouncedSearch]
  );

  const fetchBranchDetail = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await repo.getBranchById(id);
      setSelectedBranch(data);
      return data;
    } catch (err) {
      toast.error("Failed to load branch details");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableAdmins = useCallback(async () => {
    try {
      const admins = await repo.getAvailableAdmins();
      setAvailableAdmins(admins);
    } catch (err) {
      console.error("Failed to load admins", err);
    }
  }, []);

  const fetchSchedules = useCallback(async (branchId: string) => {
    try {
      setIsLoadingSchedules(true);
      const data = await repo.getSchedules(branchId);
      setCurrentSchedules(data);
    } catch (err) {
      toast.error("Failed to load schedules");
    } finally {
      setIsLoadingSchedules(false);
    }
  }, []);

  const handlePageChange = (page: number) => {
    fetchBranches(page);
  };

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setBranchDialogOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchDialogOpen(true);
  };

  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteDialogOpen(true);
  };

  const handleManageSchedules = (branch: Branch) => {
    setSelectedBranch(branch);
    fetchSchedules(branch.id);
    setScheduleDialogOpen(true);
  };

  const handleAssignAdminClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setAssignAdminDialogOpen(true);
  };

  const handleViewAdmins = (branch: Branch) => {
    setSelectedBranch(branch);
    setViewAdminsDialogOpen(true);
  };

  const handleBranchSubmit = async (values: CreateBranchPayload | UpdateBranchPayload) => {
    try {
      setIsSubmitting(true);
      if (selectedBranch) {
        await repo.updateBranch(selectedBranch.id, values);
        toast.success("Branch updated");
        // Update local selected branch state if we are in detail view
        const updated = await repo.getBranchById(selectedBranch.id);
        setSelectedBranch(updated);
      } else {
        await repo.createBranch(values as CreateBranchPayload);
        toast.success("Branch created");
      }
      setBranchDialogOpen(false);
      fetchBranches(meta.page);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBranch) return;
    try {
      setIsDeleting(true);
      await repo.deleteBranch(selectedBranch.id);
      toast.success("Branch deleted");
      setDeleteDialogOpen(false);
      fetchBranches(meta.page);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleScheduleSubmit = async (values: CreateSchedulePayload | UpdateSchedulePayload) => {
    const targetBranchId = selectedBranch?.id;
    if (!targetBranchId) return;

    try {
      setIsLoadingSchedules(true);
      if ((values as any).id && !(values as any).id.startsWith("placeholder")) {
        await repo.updateSchedule((values as any).id, values as UpdateSchedulePayload);
      } else {
        await repo.createSchedule(targetBranchId, values as CreateSchedulePayload);
      }
      toast.success("Schedule updated");
      fetchSchedules(targetBranchId);
    } catch (err: any) {
      toast.error(err.message || "Failed to update schedule");
    } finally {
        setIsLoadingSchedules(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    const targetBranchId = selectedBranch?.id;
    if (!targetBranchId) return;

    try {
      setIsLoadingSchedules(true);
      await repo.deleteSchedule(scheduleId);
      toast.success("Schedule removed");
      fetchSchedules(targetBranchId);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove schedule");
    } finally {
        setIsLoadingSchedules(false);
    }
  };

  const fetchEmployees = useCallback(async (params?: { search?: string; branchId?: string }) => {
    try {
      setIsLoadingEmployees(true);
      const data = await repo.getAllEmployees(params);
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  const handleAddEmployee = () => {
    setEmployeeDialogOpen(true);
  };

  const handleEmployeeSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await repo.createEmployee(values);
      toast.success("Employee created successfully");
      setEmployeeDialogOpen(false);
      
      // Refresh current employee list if we are in a specific branch view
      if (values.branchId && values.branchId !== "none") {
        fetchEmployees({ branchId: values.branchId });
      } else {
        fetchEmployees();
      }
      
      fetchAvailableAdmins();
    } catch (err: any) {
      toast.error(err.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignAdmin = async (employeeId: string) => {
    if (!selectedBranch) return;
    try {
      await repo.assignAdmin(selectedBranch.id, employeeId);
      toast.success("Admin assigned");
      fetchBranches(meta.page);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign admin");
    }
  };

  return {
    branches,
    meta,
    isLoading,
    searchQuery,
    debouncedSearch,
    fetchBranches,
    fetchAvailableAdmins,
    branchDialogOpen,
    setBranchDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    scheduleDialogOpen,
    setScheduleDialogOpen,
    assignAdminDialogOpen,
    setAssignAdminDialogOpen,
    selectedBranch,
    setSelectedBranch,
    isSubmitting,
    isDeleting,
    availableAdmins,
    currentSchedules,
    isLoadingSchedules,
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
    handleAssignAdmin,
    handleAddEmployee,
    handleEmployeeSubmit,
    fetchEmployees,
    fetchBranchDetail,
    employees,
    isLoadingEmployees,
    employeeDialogOpen,
    setEmployeeDialogOpen,
    viewAdminsDialogOpen,
    setViewAdminsDialogOpen,
  };
};
