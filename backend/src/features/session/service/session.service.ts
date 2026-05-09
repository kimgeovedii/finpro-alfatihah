import { UAParser } from "ua-parser-js";
import { SessionRepository } from "../repositories/session.repository";
import { blacklistToken } from "../../auth/utils/tokenBlacklist";

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async getActiveSessions(userId: string, currentSessionId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      this.sessionRepository.getActiveSessions(userId, skip, limit),
      this.sessionRepository.countActiveSessions(userId),
    ]);

    const data = sessions.map((session) => {
      const parser = new UAParser(session.device || "");
      const browser = parser.getBrowser();
      const os = parser.getOS();
      const device = parser.getDevice();

      return {
        id: session.id,
        browser: `${browser.name || "Unknown"} ${browser.version || ""}`.trim(),
        os: `${os.name || "Unknown"} ${os.version || ""}`.trim(),
        deviceType: device.type || "desktop",
        ip: session.ip || "Unknown",
        lastActive: session.createdAt,
        isCurrentDevice: session.id === currentSessionId,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async revokeSession(sessionId: string, userId: string) {
    const session = await this.sessionRepository.findSessionById(sessionId);
    
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or unauthorized");
    }

    // Delete from DB
    await this.sessionRepository.deleteSession(sessionId, userId);

    // Blacklist in Redis (use 1 day expiry to be safe, or sync with token expiry)
    await blacklistToken(sessionId, 24 * 60 * 60);

    return { message: "Session revoked successfully" };
  }
}
