import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { UserService } from "../services/user.service";
import { 
  CreateAccountSchema, 
  UpdateAccountSchema 
} from "../validation/user.dto";
import { sendSuccess, sendError } from "../../../utils/apiResponse";
import { EmployeeRole } from "@prisma/client";

export class EmployeeController {
  constructor(private userService: UserService) {}

  getAllEmployees = async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const role = req.query.role as EmployeeRole | undefined;

      const result = await this.userService.getAllAccounts({
        page,
        limit,
        search,
        role,
      });

      const formattedData = result.data.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        employee: user.employee
          ? {
              id: user.employee.id,
              fullName: user.employee.fullName,
              role: user.employee.role,
              branchId: user.employee.branchId,
              branch: user.employee.branch,
              userId: user.employee.userId,
            }
          : undefined,
      }));

      return sendSuccess(res, { data: formattedData, meta: result.meta }, "Berhasil mengambil data employee");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengambil data employee", 500);
    }
  };

  createEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const validation = CreateAccountSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const newAccount = await this.userService.createAccount(validation.data);
      return sendSuccess(res, newAccount, "Akun Employee berhasil dibuat", 201);
    } catch (error: any) {
      if (error.message.includes("sudah terdaftar")) {
        return sendError(res, error.message, 409);
      }
      return sendError(res, "Gagal membuat akun employee", 500);
    }
  };

  updateEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const validation = UpdateAccountSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const updatedAccount = await this.userService.updateAccount(id, validation.data);
      return sendSuccess(res, updatedAccount, "Akun Employee berhasil diupdate");
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        return sendError(res, error.message, 404);
      }
      if (error.message.includes("sudah digunakan")) {
        return sendError(res, error.message, 409);
      }
      return sendError(res, "Gagal mengupdate akun employee", 500);
    }
  };

  deleteEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const result = await this.userService.deleteAccount(id);
      return sendSuccess(res, null, result.message);
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        return sendError(res, error.message, 404);
      }
      if (error.message.includes("Tidak dapat menghapus")) {
        return sendError(res, error.message, 403);
      }
      return sendError(res, "Gagal menghapus akun employee", 500);
    }
  };
}
