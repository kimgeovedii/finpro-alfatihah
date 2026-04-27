import { prisma } from "../../../config/prisma";

export class SessionRepository {
  async getActiveSessions(userId: string, skip: number = 0, take: number = 10) {
    return prisma.token.findMany({
      where: {
        userId,
        expiredAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
  }

  async countActiveSessions(userId: string) {
    return prisma.token.count({
      where: {
        userId,
        expiredAt: {
          gt: new Date(),
        },
      },
    });
  }

  async deleteSession(sessionId: string, userId: string) {
    return prisma.token.delete({
      where: {
        id: sessionId,
        userId,
      },
    });
  }

  async findSessionById(sessionId: string) {
    return prisma.token.findUnique({
      where: { id: sessionId },
    });
  }
}
