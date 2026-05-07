import { Router } from "express";
import { BranchAdminController } from "../controllers/branch-admin.controller";
import { BranchAdminService } from "../services/branch-admin.service";
import { BranchRepository } from "../repositories/branch.repository";
import { BranchAdminRepository } from "../repositories/branch-admin.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class BranchAdminRouter {
  private router: Router;
  private branchAdminController: BranchAdminController;

  constructor() {
    this.router = Router();
    const branchRepo = new BranchRepository();
    const adminRepo = new BranchAdminRepository();
    const branchAdminService = new BranchAdminService(branchRepo, adminRepo);
    this.branchAdminController = new BranchAdminController(branchAdminService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // All routes require SUPER_ADMIN role
    this.router.use(authMiddleware);
    this.router.use(roleMiddleware([EmployeeRole.SUPER_ADMIN]));

    // Employee Management
    this.router.get("/employees/store-admins", this.branchAdminController.getAvailableAdmins);
    this.router.get("/employees", this.branchAdminController.getAllEmployees);
    this.router.post("/employees", this.branchAdminController.createEmployee);

    // Branch CRUD
    this.router.get("/", this.branchAdminController.getAllBranches);
    this.router.post("/", this.branchAdminController.createBranch);
    this.router.get("/:id", this.branchAdminController.getBranchById);
    this.router.put("/:id", this.branchAdminController.updateBranch);
    this.router.delete("/:id", this.branchAdminController.deleteBranch);
    this.router.patch("/:id/set-default", this.branchAdminController.setDefaultBranch);

    // Branch Schedules
    this.router.get("/:branchId/schedules", this.branchAdminController.getSchedules);
    this.router.post("/:branchId/schedules", this.branchAdminController.createSchedule);
    this.router.put("/schedules/:scheduleId", this.branchAdminController.updateSchedule);
    this.router.delete("/schedules/:scheduleId", this.branchAdminController.deleteSchedule);

    // Employee Assignment
    this.router.patch("/:branchId/assign-admin", this.branchAdminController.assignAdmin);
    this.router.patch("/employees/:employeeId/unassign", this.branchAdminController.unassignEmployee);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new BranchAdminRouter().getRouter();
