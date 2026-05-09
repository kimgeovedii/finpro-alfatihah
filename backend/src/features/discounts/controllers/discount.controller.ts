import { NextFunction, Response } from "express";
import { DiscountService } from "../services/discount.service";
import { sendSuccess } from "../../../utils/apiResponse";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { prisma } from "../../../config/prisma";
import { EmployeeRole } from "@prisma/client";

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountService();
  }

  public findAllDiscounts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (req.user?.userId && !req.user.employee) {
        const emp = await prisma.employee.findUnique({
          where: { userId: req.user.userId },
        });
        if (emp) req.user.employee = emp;
      }

      const { data, meta } = await this.discountService.findAllDiscounts(
        req.query,
        req.user,
      );

      sendSuccess(res, { data, meta }, "Get all discounts successfully");
    } catch (error) {
      next(error);
    }
  };

  public createDiscount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = { ...req.body };

      if (req.user?.employee) {
        body.createdBy = req.user.employee.id;
        if (req.user.employee.role === EmployeeRole.STORE_ADMIN) {
          body.branchId = req.user.employee.branchId;
        }
      }

      const data = await this.discountService.createDiscount(body);
      sendSuccess(res, data, "Create discount successfully");
    } catch (error) {
      next(error);
    }
  };

  public updateDiscount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      if (req.user?.employee?.role === EmployeeRole.STORE_ADMIN) {
        const discount = await this.discountService.getDiscountById(id);
        if (discount.branchId !== req.user.employee.branchId) {
          return res.status(403).json({
            success: false,
            message:
              "Forbidden: You can only update your own branch's discounts",
          });
        }
      }

      const data = await this.discountService.updateDiscount(id, req.body);
      sendSuccess(res, data, "Update discount successfully");
    } catch (error) {
      next(error);
    }
  };

  public deleteDiscount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      if (req.user?.employee?.role === EmployeeRole.STORE_ADMIN) {
        const discount = await this.discountService.getDiscountById(id);
        if (discount.branchId !== req.user.employee.branchId) {
          return res.status(403).json({
            success: false,
            message:
              "Forbidden: You can only delete your own branch's discounts",
          });
        }
      }

      const data = await this.discountService.deleteDiscount(id);
      sendSuccess(res, data, "Delete discount successfully");
    } catch (error) {
      next(error);
    }
  };
}
