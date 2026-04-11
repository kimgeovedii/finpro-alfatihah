import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import userRouter from "../features/user/routers/user.router";
import { ProductCategoriesRouter } from "../features/product_categories/routers/productCategories.router";

class GlobalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use("/auth", authRouter);
    this.router.use("/users", userRouter); // Basic user endpoints
    this.router.use(
      "/product-categories",
      new ProductCategoriesRouter().getRouter(),
    );
  }
}

export default new GlobalRouter().router;
