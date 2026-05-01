import { Router } from "express";

// import feature routers
import authRouter from "../features/auth/routers/auth.router";
import userRouter from "../features/user/routers/user.router";
import branchRouter from "../features/branch/routers/branch.router";
import branchAdminRouter from "../features/branch/routers/branch-admin.router";
import cartRouter from "../features/carts/routers/cart.router";
import orderRouter from "../features/orders/routers/order.router";
import cartItemRouter from "../features/carts/routers/cart_item.router";
import productRouter from "../features/products/routers/product.router";
import productCategoryRouter from "../features/products/routers/productCategory.router";
import discountRouter from "../features/discounts/routers/discount.router";
import voucherRouter from "../features/vouchers/routers/voucher.router";
import branchInventoryRouter from "../features/inventories/routers/branchInventory.router";
import stockJournalRouter from "../features/inventories/routers/stockJournal.router";
import mutationJournalRouter from "../features/inventories/routers/mutationJournal.router";
import paymentRouter from "../features/payments/routers/payment.router";
import addressRouter from "../features/address/routers/address.router";
import sessionRouter from "../features/session/routers/session.router";
import reportRouter from "../features/reports/routers/report.router";

class GlobalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use("/auth", authRouter);
    this.router.use("/sessions", sessionRouter);
    this.router.use("/users", userRouter); // Basic user endpoints
    this.router.use("/addresses", addressRouter);
    this.router.use("/branches", branchRouter);
    this.router.use("/admin/branches", branchAdminRouter);
    this.router.use("/carts", cartRouter);
    this.router.use("/orders", orderRouter);
    this.router.use("/payments", paymentRouter);
    this.router.use("/carts/items", cartItemRouter);
    this.router.use("/product-categories", productCategoryRouter);
    this.router.use("/products", productRouter);
    this.router.use("/discounts", discountRouter);
    this.router.use("/vouchers", voucherRouter);
    this.router.use("/branch-inventories", branchInventoryRouter);
    this.router.use("/stock-journals", stockJournalRouter);
    this.router.use("/mutations", mutationJournalRouter);
    this.router.use("/reports", reportRouter);
  }
}

export default new GlobalRouter().router;
