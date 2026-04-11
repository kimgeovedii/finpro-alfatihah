import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import userRouter from "../features/user/routers/user.router";
import { ProductRouter } from "../features/products/routers/product.router";
import { ProductCategoryRouter } from "../features/products/routers/productCategory.router";

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
      new ProductCategoryRouter().getRouter(),
    );
    this.router.use("/products", new ProductRouter().getRouter());
  }
}

export default new GlobalRouter().router;
