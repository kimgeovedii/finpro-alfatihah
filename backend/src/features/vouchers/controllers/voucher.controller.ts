import { NextFunction, Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";
import { sendSuccess } from "../../../utils/apiResponse";

export class VoucherController {
  private voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  public findAllVouchers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } = await this.voucherService.findAllVouchers(
        filters,
        Number(page),
        Number(limit),
      );

      sendSuccess(res, { data, meta }, "Get all vouchers successfully");
    } catch (error) {
      next(error);
    }
  };

  public createVoucher = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.voucherService.createVoucher(req.body);
      sendSuccess(res, data, "Create voucher successfully");
    } catch (error) {
      next(error);
    }
  };

  public updateVoucher = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.voucherService.updateVoucher(
        req.params.id as string,
        req.body,
      );
      sendSuccess(res, data, "Update voucher successfully");
    } catch (error) {
      next(error);
    }
  };

  public deleteVoucher = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.voucherService.deleteVoucher(
        req.params.id as string,
      );
      sendSuccess(res, data, "Delete voucher successfully");
    } catch (error) {
      next(error);
    }
  };
}
