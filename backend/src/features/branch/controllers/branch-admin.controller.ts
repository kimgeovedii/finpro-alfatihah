import { Request, Response } from "express";
import { BranchAdminService } from "../services/branch-admin.service";
import { sendSuccess, sendError } from "../../../utils/apiResponse";
import { 
  CreateBranchSchema, 
  UpdateBranchSchema, 
  CreateScheduleSchema, 
  UpdateScheduleSchema, 
  AssignAdminSchema 
} from "../validation/branch-admin.dto";

export class BranchAdminController {
  constructor(private branchAdminService: BranchAdminService) {}

  getAllBranches = async (req: Request, res: Response) => {
    try {
      const result = await this.branchAdminService.getAllBranches(req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const sorted = [...result.data].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

      return sendSuccess(res, {
        branches: sorted,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }, "Branches fetched");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  getBranchById = async (req: Request, res: Response) => {
    try {
      const branch = await this.branchAdminService.getBranchById(req.params.id as string);
      return sendSuccess(res, branch);
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  };

  createBranch = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateBranchSchema.parse(req.body);
      const branch = await this.branchAdminService.createBranch(validatedData);
      return sendSuccess(res, branch, "Branch created", 201);
    } catch (error: any) {
      if (error.errors) return sendError(res, "Validation error", 400, error.errors);
      if (error.code === "P2002") return sendError(res, "Store name is already taken. Please choose another name.", 400);
      return sendError(res, error.message);
    }
  };

  updateBranch = async (req: Request, res: Response) => {
    try {
      const validatedData = UpdateBranchSchema.parse(req.body);
      const branch = await this.branchAdminService.updateBranch(req.params.id as string, validatedData);
      return sendSuccess(res, branch, "Branch updated");
    } catch (error: any) {
      if (error.errors) return sendError(res, "Validation error", 400, error.errors);
      if (error.code === "P2002") return sendError(res, "Store name is already taken. Please choose another name.", 400);
      return sendError(res, error.message);
    }
  };

  deleteBranch = async (req: Request, res: Response) => {
    try {
      await this.branchAdminService.deleteBranch(req.params.id as string);
      return sendSuccess(res, null, "Branch soft-deleted successfully");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  getSchedules = async (req: Request, res: Response) => {
    try {
      const schedules = await this.branchAdminService.getSchedules(req.params.branchId as string);
      return sendSuccess(res, schedules);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  createSchedule = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateScheduleSchema.parse(req.body);
      const schedule = await this.branchAdminService.createSchedule(req.params.branchId as string, validatedData);
      return sendSuccess(res, schedule, "Schedule created", 201);
    } catch (error: any) {
      if (error.errors) return sendError(res, "Validation error", 400, error.errors);
      return sendError(res, error.message);
    }
  };

  updateSchedule = async (req: Request, res: Response) => {
    try {
      const validatedData = UpdateScheduleSchema.parse(req.body);
      const schedule = await this.branchAdminService.updateSchedule(req.params.scheduleId as string, validatedData);
      return sendSuccess(res, schedule, "Schedule updated");
    } catch (error: any) {
      if (error.errors) return sendError(res, "Validation error", 400, error.errors);
      return sendError(res, error.message);
    }
  };

  deleteSchedule = async (req: Request, res: Response) => {
    try {
      await this.branchAdminService.deleteSchedule(req.params.scheduleId as string);
      return sendSuccess(res, null, "Schedule deleted");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  getAvailableAdmins = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string;
      const admins = await this.branchAdminService.getAvailableAdmins(search);
      return sendSuccess(res, admins);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  assignAdmin = async (req: Request, res: Response) => {
    try {
      const { employeeId } = AssignAdminSchema.parse(req.body);
      const employee = await this.branchAdminService.assignAdmin(req.params.branchId as string, employeeId);
      return sendSuccess(res, employee, "Admin assigned to branch");
    } catch (error: any) {
      if (error.errors) return sendError(res, "Validation error", 400, error.errors);
      return sendError(res, error.message);
    }
  };

  getAllEmployees = async (req: Request, res: Response) => {
    try {
      const result = await this.branchAdminService.getAllEmployees(req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      return sendSuccess(res, {
        employees: result.data,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }, "Employees fetched");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  createEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.branchAdminService.createEmployee(req.body);
      return sendSuccess(res, employee, "Employee created", 201);
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  unassignEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.branchAdminService.unassignEmployee(req.params.employeeId as string);
      return sendSuccess(res, employee, "Employee unassigned successfully");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };

  setDefaultBranch = async (req: Request, res: Response) => {
    try {
      const branch = await this.branchAdminService.setDefaultBranch(req.params.id as string);
      return sendSuccess(res, branch, "Branch set as default");
    } catch (error: any) {
      return sendError(res, error.message);
    }
  };
}
