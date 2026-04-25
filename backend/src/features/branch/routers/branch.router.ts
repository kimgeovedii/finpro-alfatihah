import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

export class BranchRouter {
  private router: Router;
  private branchController: BranchController;

  constructor() {
    this.router = Router();
    this.branchController = new BranchController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.branchController.getAllBranches);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new BranchRouter().getRouter();
