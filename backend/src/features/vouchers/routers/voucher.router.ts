import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { validate } from "../../../middleware/validate";
import { createVoucherSchema } from "../validations/voucher.schema";
import { updateDiscountSchema } from "../../discounts/validations/discount.schema";

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.routes();
  }

  private routes() {
    this.router.get("/", this.voucherController.findAllVouchers);
    this.router.post(
      "/",
      validate(createVoucherSchema),
      this.voucherController.createVoucher,
    );
    this.router.put(
      "/:id",
      validate(updateDiscountSchema),
      this.voucherController.updateVoucher,
    );
    this.router.delete("/:id", this.voucherController.deleteVoucher);
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
