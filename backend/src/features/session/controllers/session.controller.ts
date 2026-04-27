import { Response } from "express";
import { SessionService } from "../service/session.service";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { sendSuccess, sendError } from "../../../utils/apiResponse";

export class SessionController {
  constructor(private sessionService: SessionService) {}

  getActiveSessions = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const currentSessionId = req.user.sessionId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.sessionService.getActiveSessions(userId, currentSessionId, page, limit);
      return sendSuccess(res, result, "Active sessions retrieved successfully");
    } catch (error: any) {
      console.error(error);
      return sendError(res, "Internal server error");
    }
  };

  revokeSession = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const { sessionId } = req.params;

      if (sessionId === req.user.sessionId) {
        return sendError(res, "You cannot revoke your current session", 400);
      }

      const result = await this.sessionService.revokeSession(sessionId as string, userId);
      return sendSuccess(res, null, result.message);
    } catch (error: any) {
      if (error.message === "Session not found or unauthorized") {
        return sendError(res, error.message, 404);
      }
      console.error(error);
      return sendError(res, "Internal server error");
    }
  };
}
