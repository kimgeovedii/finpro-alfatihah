import { Router } from "express";
import { BranchInventoryController } from "../controllers/branchInventory.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate";
import {
  createBranchInventorySchema,
  updateBranchInventorySchema,
} from "../validations/branchInventory.schema";

export class BranchInventoryRouter {
  public router: Router;
  private branchInventoryController: BranchInventoryController;

  constructor() {
    this.router = Router();
    this.branchInventoryController = new BranchInventoryController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.branchInventoryController.findAllBranchInventories);
    
    this.router.post(
      "/",
      authMiddleware,
      validate(createBranchInventorySchema),
      this.branchInventoryController.createBranchInventory,
    );
    
    this.router.patch(
      "/:id",
      authMiddleware,
      validate(updateBranchInventorySchema),
      this.branchInventoryController.updateBranchInventory,
    );
    
    this.router.delete(
      "/:id",
      authMiddleware,
      this.branchInventoryController.deleteBranchInventory,
    );
  }

}

export default new BranchInventoryRouter().router;
