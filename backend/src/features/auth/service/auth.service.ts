import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../../../config";
import { 
  LoginDto, 
  RegisterDto, 
  VerifySetPasswordDto, 
  GoogleLoginDto, 
  ResetPasswordDto, 
  ConfirmResetPasswordDto 
} from "../validation/auth.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { generateTokens } from "../utils/generateTokens";
import { blacklistToken } from "../utils/tokenBlacklist";
import { Mailer } from "../../../config/mailer";
import { 
  getRegistrationEmailHtml, 
  getResendVerificationEmailHtml, 
  getResetPasswordEmailHtml 
} from "../view/email.view";
import { CartRepository } from "../repositories/cart.repository";
import { verifyGoogleToken } from "../../../config/google";
import { VoucherReferralRepository } from "../../vouchers/repositories/voucherReferral.repository";

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private cartRepository: CartRepository,
    private voucherReferralRepository: VoucherReferralRepository
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    
    if (existingUser) {
      if (existingUser.emailVerifiedAt) {
        throw new Error("Email already in use");
      }
      
      // If user exists but not verified, update token and resend
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry per requirement

      await this.authRepository.updateVerificationToken(existingUser.id, verificationToken, expiresAt);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
      const emailHtml = getResendVerificationEmailHtml(verificationUrl);
      
      await Mailer.client.sendMail({
        from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
        to: dto.email,
        subject: "Verify Your Email - Alfatihah Apps",
        html: emailHtml,
      });

      return { message: "Email verification link has been resent." };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Referral Logic
    let referredBy = null;
    if (dto.referralCode) {
      referredBy = await this.authRepository.findByReferralCode(dto.referralCode);
    }

    const user = await this.authRepository.createUserEmailOnly(
      dto.email, 
      verificationToken, 
      expiresAt,
      referredBy?.id
    );

    // If successfully referred, record it in voucher_referral
    if (referredBy) {
      await this.voucherReferralRepository.createVoucherReferral({
        userId: user.id
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const emailHtml = getRegistrationEmailHtml(verificationUrl);
    
    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: "Welcome to Alfatihah! Verify Your Email",
      html: emailHtml,
    });

    return { message: "Registration successful. Please check your email to set your password." };
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
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.authRepository.updateVerificationToken(user.id, verificationToken, expiresAt);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const emailHtml = getResendVerificationEmailHtml(verificationUrl);

    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email - Alfatihah Apps",
      html: emailHtml,
    });

    return { message: "Verification email resent successfully" };
  }

  async verifyAndSetPassword(dto: VerifySetPasswordDto) {
    const user = await this.authRepository.findByVerificationToken(dto.token);
    
    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error("Verification link has expired. Please register again.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.authRepository.setPasswordAndVerify(user.id, hashedPassword);

    return { message: "Password has been set successfully. You can now login." };
  }

  async verifyEmailOnly(token: string) {
    const user = await this.authRepository.findByVerificationToken(token);
    
    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new Error("Verification link has expired.");
    }

    // If there's a pending new email, update it
    if (user.newEmail) {
      await this.authRepository.verifyEmailChange(user.id, user.newEmail);
    } else {
      // Normal registration verification
      await this.authRepository.verifyEmail(user.id);
    }

    return { message: "Email has been verified successfully. You can now login." };
  }

  async login(dto: LoginDto, device?: string, ip?: string) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Akses ditolak. Silakan login melalui portal yang sesuai.");
    }

    if (!user.emailVerifiedAt) {
      throw new Error("Please verify your email before logging in");
    }

    const { password, ...userWithoutPassword } = user;
    const sessionId = uuidv4();
    const tokens = generateTokens(user, sessionId, dto.rememberMe);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (dto.rememberMe ? 30 : 1));

    if (dto.deviceId) {
      await this.authRepository.deleteExistingSessionByDevice(user.id, dto.deviceId);
    }

    await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip, sessionId, dto.deviceId);
    await this.authRepository.updateLastLogin(user.id);

    const cartItems = await this.cartRepository.getCartSummary(user.id);

    return { user: userWithoutPassword, ...tokens, cartItems };
  }

  async employeeLogin(dto: LoginDto, device?: string, ip?: string) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (user.role !== "EMPLOYEE") {
      throw new Error("Akses ditolak. Akun Anda bukan merupakan akun Employee.");
    }

    const { password, ...userWithoutPassword } = user;
    const sessionId = uuidv4();
    const tokens = generateTokens(user, sessionId, dto.rememberMe);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (dto.rememberMe ? 30 : 1));

    if (dto.deviceId) {
      await this.authRepository.deleteExistingSessionByDevice(user.id, dto.deviceId);
    }

    await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip, sessionId, dto.deviceId);
    await this.authRepository.updateLastLogin(user.id);

    return { user: userWithoutPassword, ...tokens };
  }

  async googleLogin(dto: GoogleLoginDto, device?: string, ip?: string) {
    const googleUser = await verifyGoogleToken(dto.credential);
    
    let user = await this.authRepository.findByProviderId("google", googleUser.sub);
    
    if (!user) {
      const existingUser = await this.authRepository.findByEmail(googleUser.email);
      
      if (existingUser) {
        // Link account
        user = await this.authRepository.linkGoogleAccount(existingUser.id, googleUser.sub, googleUser.picture);
      } else {
        // Create new
        user = await this.authRepository.createGoogleUser({
          email: googleUser.email,
          providerId: googleUser.sub,
          username: googleUser.name,
          avatar: googleUser.picture,
        });
      }
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Akses ditolak. Login Google hanya untuk akun Customer.");
    }

    const sessionId = uuidv4();
    const tokens = generateTokens(user, sessionId, true);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    if (dto.deviceId) {
      await this.authRepository.deleteExistingSessionByDevice(user.id, dto.deviceId);
    }

    await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip, sessionId, dto.deviceId);
    await this.authRepository.updateLastLogin(user.id);

    const { password, ...userWithoutPassword } = user;
    let cartItems = null;
    if (user.role === "CUSTOMER") cartItems = await this.cartRepository.getCartSummary(user.id);

    return { user: userWithoutPassword, ...tokens, cartItems };
  }

  async requestResetPassword(email: string) {
    const user = await this.authRepository.findByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not for security, but requirement says "link to email sesuai"
      // We'll just return success always to prevent enumeration.
      return { message: "If your email is registered, you will receive a reset link shortly." };
    }

    if (user.provider !== "credentials") {
      throw new Error("This account uses social login. Please login using your social provider.");
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.authRepository.updateResetPasswordToken(user.id, resetToken, expiresAt);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/confirm-reset-password?token=${resetToken}`;
    const emailHtml = getResetPasswordEmailHtml(resetUrl);

    await Mailer.client.sendMail({
      from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password - Alfatihah Apps",
      html: emailHtml,
    });

    return { message: "Reset link has been sent to your email." };
  }

  async confirmResetPassword(dto: ConfirmResetPasswordDto) {
    const user = await this.authRepository.findUserByResetToken(dto.token);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.authRepository.resetPassword(user.id, hashedPassword);

    return { message: "Password has been reset successfully. You can now login with your new password." };
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

      const sessionId = uuidv4();
      const tokens = generateTokens(user, sessionId);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await this.authRepository.createRefreshToken(user.id, tokens.refreshToken, expiresAt, device, ip, sessionId, dbToken.deviceId as string);

      return tokens;
    } catch (error) {
      await this.authRepository.deleteRefreshToken(token).catch(() => {});
      throw new Error("Invalid refresh token");
    }
  }

  async me(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) return null;
    let { password, ...userWithoutPassword } = user;

    let cartItems = null;
    if (user.role === "CUSTOMER") cartItems = await this.cartRepository.getCartSummary(user.id);
    
    return { ...userWithoutPassword, cartItems };
  }

  async logout(accessToken: string, refreshToken?: string) {
    try {
      const decoded: any = jwt.verify(accessToken, JWT_SECRET);
      if (decoded.sessionId) {
        await blacklistToken(decoded.sessionId, 15 * 60);
      }
    } catch (error) {
      // If token is already invalid, we just continue to delete refresh token if any
    }

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
