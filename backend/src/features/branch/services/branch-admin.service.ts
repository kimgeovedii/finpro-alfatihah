import { BranchRepository } from "../repositories/branch.repository";
import { BranchAdminRepository } from "../repositories/branch-admin.repository";

export class BranchAdminService {
  constructor(
    private branchRepo: BranchRepository,
    private adminRepo: BranchAdminRepository
  ) {}

  async getAllBranches(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || undefined;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    return this.branchRepo.findAll({ page, limit, search, sortBy, sortOrder });
  }

  async getBranchById(id: string) {
    const branch = await this.branchRepo.findById(id);
    if (!branch) throw new Error("Branch not found");
    return branch;
  }

  async createBranch(data: any) {
    return this.branchRepo.create(data);
  }

  async updateBranch(id: string, data: any) {
    const branch = await this.branchRepo.findById(id);
    if (!branch) throw new Error("Branch not found");
    return this.branchRepo.update(id, data);
  }

  async deleteBranch(id: string) {
    const branch = await this.branchRepo.findById(id);
    if (!branch) throw new Error("Branch not found");
    return this.branchRepo.softDelete(id);
  }

  async getSchedules(branchId: string) {
    const days: any[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const existing = await this.adminRepo.findSchedulesByBranchId(branchId);
    
    // Merge existing schedules with all 7 days
    return days.map(day => {
      const found = existing.find(s => s.dayName === day);
      if (found) return found;
      return {
        id: `placeholder-${day}`,
        branchId,
        dayName: day,
        startTime: null,
        endTime: null,
        isPlaceholder: true
      };
    });
  }

  async createSchedule(branchId: string, data: any) {
    // Upsert logic: Check if schedule for this day already exists
    const existing = await this.adminRepo.findSchedulesByBranchId(branchId);
    const found = existing.find(s => s.dayName === data.dayName);
    
    if (found) {
      return this.adminRepo.updateSchedule(found.id, data);
    }
    
    return this.adminRepo.createSchedule(branchId, data);
  }

  async updateSchedule(scheduleId: string, data: any) {
    return this.adminRepo.updateSchedule(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string) {
    return this.adminRepo.deleteSchedule(scheduleId);
  }

  async getAvailableAdmins(search?: string) {
    return this.adminRepo.findAvailableStoreAdmins(search);
  }

  async getAllEmployees(query: { search?: string; role?: any }) {
    return this.adminRepo.findAllEmployees(query);
  }

  async createEmployee(data: any) {
    return this.adminRepo.createEmployee(data);
  }

  async assignAdmin(branchId: string, employeeId: string) {
    return this.adminRepo.assignEmployee(branchId, employeeId);
  }
}
