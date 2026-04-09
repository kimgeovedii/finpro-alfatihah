import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import userRouter from "../features/user/routers/user.router";
import cartRouter from "../features/carts/routers/cart.router"

class GlobalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use("/auth", authRouter);
    this.router.use("/users", userRouter); // Basic user endpoints
    this.router.use("/carts", cartRouter)
  }
}

export default new GlobalRouter().router;
