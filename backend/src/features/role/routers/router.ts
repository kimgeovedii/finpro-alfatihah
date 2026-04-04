import { Router } from "express";
import { RoleController } from "../controllers/controller";

class RoleRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    // define role management routes here
    // e.g. this.router.get('/', RoleController.listRoles);
  }
}

export default new RoleRouter().router;
