import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { REFRESH_TOKEN_SECRET } from "../../../config";
import { LoginDto, RegisterDto } from "../validation/auth.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { generateTokens } from "../utils/generateTokens";
import { blacklistToken } from "../utils/tokenBlacklist";
import { Mailer } from "../../../config/mailer";
import { getRegistrationEmailHtml, getResendVerificationEmailHtml } from "../view/email.view";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.authRepository.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 jam untuk verifikasi

    await this.authRepository.updateVerificationToken(user.id, verificationToken, expiresAt);

    // Kirim email verifikasi
    const emailHtml = getRegistrationEmailHtml(user.name, verificationToken);
    
    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: "Verify Your Email Address - Alfatihah Apps",
      html: emailHtml,
    });

    return { message: "Registration successful. Please check your email to verify your account." };
  }

  async resendVerification(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerifiedAt) {
      throw new Error("Email is already verified");
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.authRepository.updateVerificationToken(user.id, verificationToken, expiresAt);

    const emailHtml = getResendVerificationEmailHtml(user.name, verificationToken);

    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email Address - Alfatihah Apps",
      html: emailHtml,
    });

    return { message: "Verification email resent successfully" };
  }

  async verifyEmail(token: string) {
    const user = await this.authRepository.findByVerificationToken(token);
    
    if (!user) {
      throw new Error("Invalid verification token");
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error("Verification token has expired");
    }

    await this.authRepository.verifyEmail(user.id);
    return { message: "Email successfully verified. You can now login." };
  }

  async login(dto: LoginDto, device?: string, ip?: string) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (!user.emailVerifiedAt) {
      throw new Error("Please verify your email before logging in");
    }

    const { password, ...userWithoutPassword } = user;
    const tokens = generateTokens(user, dto.rememberMe);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (dto.rememberMe ? 30 : 1));

    await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip);
    
    await this.authRepository.updateLastLogin(user.id);

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(token: string, device?: string, ip?: string) {
    const dbToken = await this.authRepository.findRefreshToken(token);
    if (!dbToken) {
      throw new Error("Invalid or revoked refresh token");
    }

    try {
      const decoded: any = jwt.verify(token, REFRESH_TOKEN_SECRET);
      const user = await this.authRepository.findByEmail(decoded.email);

      if (!user) {
        throw new Error("User not found");
      }

      await this.authRepository.deleteRefreshToken(token);

      const tokens = generateTokens(user);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip);

      return tokens;
    } catch (error) {
      await this.authRepository.deleteRefreshToken(token).catch(() => {});
      throw new Error("Invalid refresh token");
    }
  }

  async me(email: string) {
     const user = await this.authRepository.findByEmail(email);
     if (!user) return null;
     const { password, ...userWithoutPassword } = user;
     return userWithoutPassword;
  }

  async logout(accessToken: string, refreshToken?: string) {
    await blacklistToken(accessToken, 15 * 60);

    if (refreshToken) {
      await this.authRepository.deleteRefreshToken(refreshToken).catch(() => {});
    }

    return { message: "Logged out successfully" };
  }

  async revokeAllSessions(userId: string) {
    await this.authRepository.deleteAllRefreshTokensByUserId(userId);
    return { message: "All sessions revoked successfully" };
  }
}

