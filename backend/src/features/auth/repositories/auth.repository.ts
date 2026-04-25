import { prisma } from "../../../config/prisma";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByProviderId(provider: string, providerId: string) {
    return prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  async createRefreshToken(userId: string, token: string, expiresAt: Date, device?: string, ip?: string) {
    return prisma.token.create({
      data: {
        userId,
        token,
        expiredAt: expiresAt,
        device,
        ip,
      },
    });
  }

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async createUserEmailOnly(email: string, verificationToken: string, expires: Date) {
    return prisma.user.create({
      data: {
        email,
        verificationToken,
        verificationExpires: expires,
        provider: "credentials",
      },
    });
  }

  async createGoogleUser(data: { email: string; providerId: string; username?: string; avatar?: string }) {
    return prisma.user.create({
      data: {
        ...data,
        provider: "google",
        emailVerifiedAt: new Date(), // Google emails are pre-verified
      },
    });
  }

  async linkGoogleAccount(userId: string, providerId: string, avatar?: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        provider: "google",
        providerId,
        ...(avatar && { avatar }),
        emailVerifiedAt: new Date(),
      },
    });
  }

  async updateVerificationToken(userId: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: token,
        verificationExpires: expires,
      },
    });
  }

  async setPasswordAndVerify(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });
  }

  async verifyEmail(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });
  }

  async findByVerificationToken(token: string) {
    return prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.token.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.token.delete({
      where: { token },
    });
  }

  async deleteAllRefreshTokensByUserId(userId: string) {
    return prisma.token.deleteMany({
      where: { userId },
    });
  }

  // Reset Password methods
  async updateResetPasswordToken(userId: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async findUserByResetToken(token: string) {
    return prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
  }

  async resetPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
