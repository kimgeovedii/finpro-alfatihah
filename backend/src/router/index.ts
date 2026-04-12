import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import userRouter from "../features/user/routers/user.router";
import { ProductRouter } from "../features/products/routers/product.router";
import { ProductCategoryRouter } from "../features/products/routers/productCategory.router";
import { DiscountRouter } from "../features/discounts/routers/discount.router";
import { VoucherRouter } from "../features/vouchers/routers/voucher.router";
import { BranchInventoryRouter } from "../features/inventories/routers/branchInventory.router";
import { StockJournalRouter } from "../features/inventories/routers/stockJournal.router";
import { MutationJournalRouter } from "../features/inventories/routers/mutationJournal.router";

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
    this.router.use("/discounts", new DiscountRouter().getRouter());
    this.router.use("/vouchers", new VoucherRouter().getRouter());
    this.router.use("/branch-inventories", new BranchInventoryRouter().getRouter());
    this.router.use("/stock-journals", new StockJournalRouter().getRouter());
    this.router.use("/mutations", new MutationJournalRouter().getRouter());
  }
}

export default new GlobalRouter().router;
