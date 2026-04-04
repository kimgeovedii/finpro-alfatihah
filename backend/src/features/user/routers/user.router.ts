import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";

class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();

    // Dependency Injection
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    this.userController = new UserController(userService);

    this.registerRoutes();
  }

  private registerRoutes() {
    // All user routes protected by authMiddleware
    this.router.use(authMiddleware);
    
    this.router.get("/", this.userController.getUsers);
    this.router.get("/:id", this.userController.getUserById);
  }
}

export default new UserRouter().router;
