import { apiFetch } from "@/utils/api";
import {
  BranchListResponse,
  Branch,
  BranchSchedule,
  Employee,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  EmployeeListResponse,
} from "../types/branch-admin.type";

export class BranchAdminRepository {
  public getAllBranches = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  ): Promise<BranchListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    return await apiFetch<BranchListResponse>(
      `/admin/branches?${params.toString()}`,
      "get"
    );
  };

  public getBranchById = async (id: string): Promise<Branch> => {
    return await apiFetch<Branch>(`/admin/branches/${id}`, "get");
  };

  public createBranch = async (payload: CreateBranchPayload): Promise<Branch> => {
    return await apiFetch<Branch>("/admin/branches", "post", payload);
  };

  public updateBranch = async (id: string, payload: UpdateBranchPayload): Promise<Branch> => {
    return await apiFetch<Branch>(`/admin/branches/${id}`, "put", payload);
  };

  public deleteBranch = async (id: string): Promise<void> => {
    await apiFetch<void>(`/admin/branches/${id}`, "delete");
  };

  public getSchedules = async (branchId: string): Promise<BranchSchedule[]> => {
    return await apiFetch<BranchSchedule[]>(`/admin/branches/${branchId}/schedules`, "get");
  };

  public createSchedule = async (branchId: string, payload: CreateSchedulePayload): Promise<BranchSchedule> => {
    return await apiFetch<BranchSchedule>(`/admin/branches/${branchId}/schedules`, "post", payload);
  };

  public updateSchedule = async (scheduleId: string, payload: UpdateSchedulePayload): Promise<BranchSchedule> => {
    return await apiFetch<BranchSchedule>(`/admin/branches/schedules/${scheduleId}`, "put", payload);
  };

  public deleteSchedule = async (scheduleId: string): Promise<void> => {
    await apiFetch<void>(`/admin/branches/schedules/${scheduleId}`, "delete");
  };

  public getAvailableAdmins = async (search?: string): Promise<Employee[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return await apiFetch<Employee[]>(`/admin/branches/employees/store-admins${query}`, "get");
  };

  public getAllEmployees = async (params?: { search?: string; role?: string; branchId?: string; isUnassigned?: boolean; page?: number; limit?: number }): Promise<EmployeeListResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.role) query.set("role", params.role);
    if (params?.branchId) query.set("branchId", params.branchId);
    if (params?.isUnassigned) query.set("isUnassigned", "true");
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    
    return await apiFetch<EmployeeListResponse>(`/admin/branches/employees?${query.toString()}`, "get");
  };

  public createEmployee = async (payload: { fullName: string; email: string; role: string; branchId?: string }): Promise<Employee> => {
    return await apiFetch<Employee>("/admin/branches/employees", "post", payload);
  };

  public assignAdmin = async (branchId: string, employeeId: string): Promise<void> => {
    await apiFetch<void>(`/admin/branches/${branchId}/assign-admin`, "patch", { employeeId });
  };

  public unassignEmployee = async (employeeId: string): Promise<void> => {
    await apiFetch<void>(`/admin/branches/employees/${employeeId}/unassign`, "patch");
  };
}
