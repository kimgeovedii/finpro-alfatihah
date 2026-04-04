import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import roleRouter from "../features/role/routers/router";
import userRouter from "../features/user/routers/user.router";

class GlobalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use("/auth", authRouter);
    this.router.use("/roles", roleRouter);
    this.router.use("/users", userRouter); // Basic user endpoints
  }
}

export default new GlobalRouter().router;
