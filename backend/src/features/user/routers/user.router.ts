import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { EmployeeController } from "../controllers/employee.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { roleMiddleware } from "../../../middleware/role.middleware";
import { EmployeeRole } from "@prisma/client";
import { upload } from "../../../middleware/uploader.middleware";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private employeeController: EmployeeController;

  constructor() {
    this.router = Router();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    this.userController = new UserController(userService);
    this.employeeController = new EmployeeController(userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // All routes require authentication
    this.router.use(authMiddleware);

    // Profile Management (Accessible by all users)
    this.router.get("/profile", this.userController.getProfile);
    this.router.patch("/profile", this.userController.updateProfile);
    this.router.patch("/avatar", upload.single("avatar"), this.userController.updateAvatar);
    this.router.patch("/password", this.userController.changePassword);
    this.router.patch("/email", this.userController.changeEmail);

    // Account Management (Accessible only by SUPER_ADMIN)
    const adminRoutes = Router();
    adminRoutes.use(roleMiddleware([EmployeeRole.SUPER_ADMIN]));
    
    adminRoutes.get("/", this.employeeController.getAllEmployees);
    adminRoutes.post("/", this.employeeController.createEmployee);
    adminRoutes.put("/:id", this.employeeController.updateEmployee);
    adminRoutes.delete("/:id", this.employeeController.deleteEmployee);

    this.router.use("/", adminRoutes);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new UserRouter().getRouter();
