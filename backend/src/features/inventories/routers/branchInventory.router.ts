import { Router } from "express";
import { BranchInventoryController } from "../controllers/branchInventory.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate";
import {
  createBranchInventorySchema,
  updateBranchInventorySchema,
} from "../validations/branchInventory.schema";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";

export class BranchInventoryRouter {
  public router: Router;
  private branchInventoryController: BranchInventoryController;

  constructor() {
    this.router = Router();
    this.branchInventoryController = new BranchInventoryController();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      this.branchInventoryController.findAllBranchInventories,
    );

    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      validate(createBranchInventorySchema),
      this.branchInventoryController.createBranchInventory,
    );

    this.router.patch(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      validate(updateBranchInventorySchema),
      this.branchInventoryController.updateBranchInventory,
    );

    this.router.delete(
      "/:id",
      authMiddleware,
      roleMiddleware([EmployeeRole.STORE_ADMIN, EmployeeRole.SUPER_ADMIN]),
      this.branchInventoryController.deleteBranchInventory,
    );
  }

}

export default new BranchInventoryRouter().router;
