import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { UserService } from "../services/user.service";
import { 
  CreateAccountSchema, 
  UpdateAccountSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ChangeEmailSchema
} from "../validation/user.dto";
import { sendSuccess, sendError } from "../../../utils/apiResponse";
import { EmployeeRole } from "@prisma/client";
import { cloudinaryUpload } from "../../../config/cloudinary";

export class UserController {
  constructor(private userService: UserService) {}

  getAllAccounts = async (req: AuthRequest, res: Response) => {
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

      return sendSuccess(res, { data: formattedData, meta: result.meta }, "Berhasil mengambil data akun");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengambil data akun", 500);
    }
  };

  createAccount = async (req: AuthRequest, res: Response) => {
    try {
      const validation = CreateAccountSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const newAccount = await this.userService.createAccount(validation.data);
      return sendSuccess(res, newAccount, "Akun berhasil dibuat", 201);
    } catch (error: any) {
      if (error.message.includes("sudah terdaftar")) {
        return sendError(res, error.message, 409);
      }
      return sendError(res, "Gagal membuat akun", 500);
    }
  };

  updateAccount = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const validation = UpdateAccountSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const updatedAccount = await this.userService.updateAccount(id, validation.data);
      return sendSuccess(res, updatedAccount, "Akun berhasil diupdate");
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        return sendError(res, error.message, 404);
      }
      if (error.message.includes("sudah digunakan")) {
        return sendError(res, error.message, 409);
      }
      return sendError(res, "Gagal mengupdate akun", 500);
    }
  };

  deleteAccount = async (req: AuthRequest, res: Response) => {
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
      return sendError(res, "Gagal menghapus akun", 500);
    }
  };

  // Profile Management Endpoints

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const user = await this.userService.getProfile(userId);
      return sendSuccess(res, user, "Berhasil mengambil profil");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengambil profil", 500);
    }
  };

  updateAvatar = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      if (!req.file) {
        return sendError(res, "File foto tidak ditemukan", 400);
      }

      const result = await cloudinaryUpload(req.file);
      const avatarUrl = result.secure_url;
      
      await this.userService.updateAvatar(userId, avatarUrl);
      return sendSuccess(res, { avatar: avatarUrl }, "Foto profil berhasil diperbarui");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal memperbarui foto profil", 500);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const validation = UpdateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      await this.userService.updateProfile(userId, validation.data);
      return sendSuccess(res, null, "Profil berhasil diperbarui");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal memperbarui profil", 500);
    }
  };

  changePassword = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const validation = ChangePasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      await this.userService.changePassword(userId, validation.data);
      return sendSuccess(res, null, "Password berhasil diubah");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengubah password", 400);
    }
  };

  changeEmail = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const validation = ChangeEmailSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const result = await this.userService.changeEmail(userId, validation.data);
      return sendSuccess(res, null, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengubah email", 400);
    }
  };
}
