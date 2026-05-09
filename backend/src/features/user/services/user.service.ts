import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository";
import { 
  CreateAccountDto, 
  UpdateAccountDto, 
  UpdateProfileDto, 
  ChangePasswordDto, 
  ChangeEmailDto 
} from "../validation/user.dto";
import { EmployeeRole } from "@prisma/client";
import { Mailer } from "../../../config/mailer";
import { getEmailChangeVerificationHtml } from "../../auth/view/email.view";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllAccounts(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    employeeOnly?: boolean;
  }) {
    return this.userRepository.findAllAccounts(params);
  }

  async createAccount(data: CreateAccountDto) {
    const existingUser = await this.userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newAccount = await this.userRepository.createEmployeeAccount(data, hashedPassword);
    return newAccount;
  }

  async updateAccount(userId: string, data: UpdateAccountDto) {
    const existingUser = await this.userRepository.findAccountById(userId);
    if (!existingUser) {
      throw new Error("Akun tidak ditemukan");
    }

    if (data.email && data.email !== existingUser.email) {
      const emailTaken = await this.userRepository.findUserByEmail(data.email);
      if (emailTaken) {
        throw new Error("Email sudah digunakan oleh akun lain");
      }
    }

    return this.userRepository.updateEmployeeAccount(userId, data);
  }

  async deleteAccount(userId: string) {
    const existingUser = await this.userRepository.findAccountById(userId);
    if (!existingUser) {
      throw new Error("Akun tidak ditemukan");
    }

    if (existingUser.employee?.role === EmployeeRole.SUPER_ADMIN) {
      throw new Error("Tidak dapat menghapus akun Super Admin");
    }

    await this.userRepository.deleteAccount(userId);
    return { message: "Akun berhasil dihapus" };
  }

  // Profile Management
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.userRepository.updateAvatar(userId, avatarUrl);
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.userRepository.updateProfile(userId, data);
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.password) throw new Error("User not found or using social login");

    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) throw new Error("Password lama tidak sesuai");

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    return this.userRepository.updatePassword(userId, hashedPassword);
  }

  async changeEmail(userId: string, data: ChangeEmailDto) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.password) throw new Error("User not found or using social login");

    if (user.email !== data.oldEmail) throw new Error("Email lama tidak sesuai");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Password tidak sesuai");

    const emailTaken = await this.userRepository.findUserByEmail(data.newEmail);
    if (emailTaken) throw new Error("Email baru sudah terdaftar");

    // Store new email and verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.user.update({
      where: { id: userId },
      data: {
        newEmail: data.newEmail,
        verificationToken,
        verificationExpires: expiresAt
      }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}&type=email-change`;
    const htmlContent = getEmailChangeVerificationHtml(verificationUrl);

    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: data.newEmail,
      subject: "Verifikasi Email Baru Alfatihah Apps",
      html: htmlContent,
    });

    return { message: "Email berhasil diubah. Silakan verifikasi email baru Anda." };
  }
}

// Global prisma import for the changeEmail method if needed, or better use repository
import { prisma } from "../../../config/prisma";
