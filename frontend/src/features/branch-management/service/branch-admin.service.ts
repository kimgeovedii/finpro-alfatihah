import { create } from "zustand";
import { BranchAdminRepository } from "../repository/branch-admin.repository";
import {
  Branch,
  BranchSchedule,
  Employee,
  PaginationMeta,
  BranchListResponse,
  EmployeeListResponse,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from "../types/branch-admin.type";

const repo = new BranchAdminRepository();

interface BranchAdminState {
  // Branch data
  branches: Branch[];
  meta: PaginationMeta;
  selectedBranch: Branch | null;
  isLoading: boolean;

  // Employee data
  employees: Employee[];
  employeeMeta: PaginationMeta;
  employeeFilter: "all" | "unassigned";
  availableAdmins: Employee[];
  selectedEmployee: Employee | null;
  isLoadingEmployees: boolean;

  // Schedule data
  currentSchedules: BranchSchedule[];
  isLoadingSchedules: boolean;

  // UI state
  isSubmitting: boolean;
  isDeleting: boolean;
  searchQuery: string;
  debouncedSearch: string;

  // Dialog states
  branchDialogOpen: boolean;
  deleteDialogOpen: boolean;
  scheduleDialogOpen: boolean;
  assignAdminDialogOpen: boolean;
  viewAdminsDialogOpen: boolean;
  employeeDialogOpen: boolean;
  assignEmployeeDialogOpen: boolean;

  // Setters
  setBranches: (branches: Branch[]) => void;
  setMeta: (meta: PaginationMeta) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setIsLoading: (loading: boolean) => void;
  setEmployees: (employees: Employee[]) => void;
  setEmployeeMeta: (meta: PaginationMeta) => void;
  setEmployeeFilter: (filter: "all" | "unassigned") => void;
  setAvailableAdmins: (admins: Employee[]) => void;
  setSelectedEmployee: (employee: Employee | null) => void;
  setIsLoadingEmployees: (loading: boolean) => void;
  setCurrentSchedules: (schedules: BranchSchedule[]) => void;
  setIsLoadingSchedules: (loading: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setIsDeleting: (deleting: boolean) => void;
  setSearchQuery: (query: string) => void;
  setDebouncedSearch: (query: string) => void;
  setBranchDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setScheduleDialogOpen: (open: boolean) => void;
  setAssignAdminDialogOpen: (open: boolean) => void;
  setViewAdminsDialogOpen: (open: boolean) => void;
  setEmployeeDialogOpen: (open: boolean) => void;
  setAssignEmployeeDialogOpen: (open: boolean) => void;

  // Actions (async, calling repository)
  fetchBranches: (page?: number) => Promise<void>;
  fetchBranchDetail: (id: string) => Promise<Branch | null>;
  fetchAvailableAdmins: () => Promise<void>;
  fetchSchedules: (branchId: string) => Promise<void>;
  fetchEmployees: (params?: { search?: string; branchId?: string; page?: number; limit?: number }) => Promise<void>;

  createBranch: (payload: CreateBranchPayload) => Promise<void>;
  updateBranch: (id: string, payload: UpdateBranchPayload) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;

  createSchedule: (branchId: string, payload: CreateSchedulePayload) => Promise<void>;
  updateSchedule: (scheduleId: string, payload: UpdateSchedulePayload) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;

  createEmployee: (payload: { fullName: string; email: string; role: string; branchId?: string }) => Promise<void>;
  assignAdmin: (branchId: string, employeeId: string) => Promise<void>;
  unassignEmployee: (employeeId: string) => Promise<void>;
}

export const useBranchAdminStore = create<BranchAdminState>()((set, get) => ({
  // Initial state
  branches: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  selectedBranch: null,
  isLoading: true,

  employees: [],
  employeeMeta: { total: 0, page: 1, limit: 9, totalPages: 0 },
  employeeFilter: "all",
  availableAdmins: [],
  selectedEmployee: null,
  isLoadingEmployees: false,

  currentSchedules: [],
  isLoadingSchedules: false,

  isSubmitting: false,
  isDeleting: false,
  searchQuery: "",
  debouncedSearch: "",

  branchDialogOpen: false,
  deleteDialogOpen: false,
  scheduleDialogOpen: false,
  assignAdminDialogOpen: false,
  viewAdminsDialogOpen: false,
  employeeDialogOpen: false,
  assignEmployeeDialogOpen: false,

  // Setters
  setBranches: (branches) => set({ branches }),
  setMeta: (meta) => set({ meta }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setEmployees: (employees) => set({ employees }),
  setEmployeeMeta: (meta) => set({ employeeMeta: meta }),
  setEmployeeFilter: (filter) => set({ employeeFilter: filter }),
  setAvailableAdmins: (admins) => set({ availableAdmins: admins }),
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setIsLoadingEmployees: (loading) => set({ isLoadingEmployees: loading }),
  setCurrentSchedules: (schedules) => set({ currentSchedules: schedules }),
  setIsLoadingSchedules: (loading) => set({ isLoadingSchedules: loading }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setIsDeleting: (deleting) => set({ isDeleting: deleting }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDebouncedSearch: (query) => set({ debouncedSearch: query }),
  setBranchDialogOpen: (open) => set({ branchDialogOpen: open }),
  setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
  setScheduleDialogOpen: (open) => set({ scheduleDialogOpen: open }),
  setAssignAdminDialogOpen: (open) => set({ assignAdminDialogOpen: open }),
  setViewAdminsDialogOpen: (open) => set({ viewAdminsDialogOpen: open }),
  setEmployeeDialogOpen: (open) => set({ employeeDialogOpen: open }),
  setAssignEmployeeDialogOpen: (open) => set({ assignEmployeeDialogOpen: open }),

  // Async actions
  fetchBranches: async (page = 1) => {
    try {
      set({ isLoading: true });
      const { meta } = get();
      const response = await repo.getAllBranches(page, meta.limit, get().debouncedSearch || undefined);
      if (response) {
        set({ branches: response.branches, meta: response.meta });
      }
    } catch {
      // error handled by caller
      throw new Error("Failed to load branches");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBranchDetail: async (id: string) => {
    try {
      set({ isLoading: true });
      const data = await repo.getBranchById(id);
      set({ selectedBranch: data });
      if (data.schedules) {
        set({ currentSchedules: data.schedules });
      }
      return data;
    } catch {
      throw new Error("Failed to load branch details");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAvailableAdmins: async () => {
    try {
      const admins = await repo.getAvailableAdmins();
      set({ availableAdmins: admins });
    } catch (err) {
      console.error("Failed to load admins", err);
    }
  },

  fetchSchedules: async (branchId: string) => {
    try {
      set({ isLoadingSchedules: true });
      const data = await repo.getSchedules(branchId);
      set({ currentSchedules: data });
    } catch {
      throw new Error("Failed to load schedules");
    } finally {
      set({ isLoadingSchedules: false });
    }
  },

  fetchEmployees: async (params) => {
    try {
      set({ isLoadingEmployees: true });
      const { employeeFilter, employeeMeta } = get();
      const isUnassigned = employeeFilter === "unassigned";
      const response = await repo.getAllEmployees({
        ...params,
        isUnassigned,
        page: params?.page || employeeMeta.page,
        limit: params?.limit || employeeMeta.limit,
      });
      if (response && response.employees) {
        set({ employees: response.employees, employeeMeta: response.meta });
      } else {
        set({ employees: [] });
      }
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      set({ isLoadingEmployees: false });
    }
  },

  createBranch: async (payload) => {
    set({ isSubmitting: true });
    try {
      await repo.createBranch(payload);
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateBranch: async (id, payload) => {
    set({ isSubmitting: true });
    try {
      await repo.updateBranch(id, payload);
      const updated = await repo.getBranchById(id);
      set({ selectedBranch: updated });
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteBranch: async (id) => {
    set({ isDeleting: true });
    try {
      await repo.deleteBranch(id);
    } finally {
      set({ isDeleting: false });
    }
  },

  createSchedule: async (branchId, payload) => {
    set({ isLoadingSchedules: true });
    try {
      await repo.createSchedule(branchId, payload);
    } finally {
      set({ isLoadingSchedules: false });
    }
  },

  updateSchedule: async (scheduleId, payload) => {
    set({ isLoadingSchedules: true });
    try {
      await repo.updateSchedule(scheduleId, payload);
    } finally {
      set({ isLoadingSchedules: false });
    }
  },

  deleteSchedule: async (scheduleId) => {
    set({ isLoadingSchedules: true });
    try {
      await repo.deleteSchedule(scheduleId);
    } finally {
      set({ isLoadingSchedules: false });
    }
  },

  createEmployee: async (payload) => {
    set({ isSubmitting: true });
    try {
      await repo.createEmployee(payload);
    } finally {
      set({ isSubmitting: false });
    }
  },

  assignAdmin: async (branchId, employeeId) => {
    await repo.assignAdmin(branchId, employeeId);
  },

  unassignEmployee: async (employeeId) => {
    await repo.unassignEmployee(employeeId);
  },
}));
