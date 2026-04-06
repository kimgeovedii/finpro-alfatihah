import { prisma } from "../../../config/prisma";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },

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

  async createUser(data: any) {
    return prisma.user.create({
      data,
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
}
