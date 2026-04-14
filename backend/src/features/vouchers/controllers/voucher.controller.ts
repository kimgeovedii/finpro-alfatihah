import { NextFunction, Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";

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

      res
        .status(200)
        .send({ message: "Get all vouchers successfully", data, meta });
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
      res.status(200).send({ message: "Create voucher successfully", data });
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
      res.status(200).send({ message: "Update voucher successfully", data });
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
      res.status(200).send({ message: "Delete voucher successfully", data });
    } catch (error) {
      next(error);
    }
  };
}
