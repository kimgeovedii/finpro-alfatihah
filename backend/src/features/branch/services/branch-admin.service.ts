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
    const slug = data.storeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return this.branchRepo.create({ ...data, slug });
  }

  async updateBranch(id: string, data: any) {
    const branch = await this.branchRepo.findById(id);
    if (!branch) throw new Error("Branch not found");

    // If storeName is changing, regenerate slug
    if (data.storeName && data.storeName !== branch.storeName) {
      data.slug = data.storeName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

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

  async getAllEmployees(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || undefined;
    const role = query.role || undefined;
    const branchId = query.branchId || undefined;
    const isUnassigned = query.isUnassigned === "true";

    return this.adminRepo.findAllEmployees({
      search,
      role,
      branchId,
      isUnassigned,
      page,
      limit,
    });
  }

  async createEmployee(data: any) {
    return this.adminRepo.createEmployee(data);
  }

  async assignAdmin(branchId: string, employeeId: string) {
    return this.adminRepo.assignEmployee(branchId, employeeId);
  }

  async unassignEmployee(employeeId: string) {
    return this.adminRepo.unassignEmployee(employeeId);
  }

  async setDefaultBranch(id: string) {
    const branch = await this.branchRepo.findById(id);
    if (!branch) throw new Error("Branch not found");

    // Validate: branch must have products
    const { total } = await this.branchRepo.findProductsByBranch(id, 0, 1);
    if (total === 0) {
      throw new Error("Cannot set as default: this branch has no products. Please add products to this branch first.");
    }

    // Reset all defaults first, then set the target
    await this.branchRepo.resetAllDefaults();
    return this.branchRepo.setDefault(id);
  }
}
