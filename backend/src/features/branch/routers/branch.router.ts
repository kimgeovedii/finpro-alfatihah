import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";
import { validate } from "../../../middleware/validate";
import { NearestBranchQuerySchema } from "../validation/branch.validation";

export class BranchRouter {
  private router: Router;
  private branchController: BranchController;

  constructor() {
    this.router = Router();
    this.branchController = new BranchController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/nearest",
      validate(NearestBranchQuerySchema, "query"),
      this.branchController.getNearestBranch
    );
    this.router.get("/", this.branchController.getAllBranches);
    this.router.get("/:slug", this.branchController.getBranchBySlug);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new BranchRouter().getRouter();
