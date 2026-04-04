import { Response } from "express";
import { AuthService } from "../service/auth.service";
import { LoginSchema, RegisterSchema } from "../validation/auth.dto";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { sendSuccess, sendError } from "../../../utils/apiResponse";

export class AuthController {
  constructor(private authService: AuthService) { }

  register = async (req: AuthRequest, res: Response) => {
    try {
      const result = RegisterSchema.safeParse(req.body);
      if (!result.success) {
        return sendError(res, "Validation failed", 400, result.error.flatten());
      }
      const data = await this.authService.register(result.data);
      return sendSuccess(res, data, "Registration successful");
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return sendError(res, error.message, 400);
      }
      console.error(error);
      return sendError(res, "Internal server error");
    }
  }

  resendVerification = async (req: AuthRequest, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return sendError(res, "Email is required", 400);
      }
      const data = await this.authService.resendVerification(email);
      return sendSuccess(res, data, "Verification email resent");
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  verifyEmail = async (req: AuthRequest, res: Response) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return sendError(res, "Invalid token", 400);
      }

      const data = await this.authService.verifyEmail(token);
      return sendSuccess(res, data, "Email verified successfully");
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  login = async (req: AuthRequest, res: Response) => {
    try {
      const result = LoginSchema.safeParse(req.body);
      if (!result.success) {
        return sendError(res, "Validation failed", 400, result.error.flatten());
      }

      const device = req.headers["user-agent"] || "Unknown Device";
      const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP") as string;

      const data = await this.authService.login(result.data, device, ip);
      return sendSuccess(res, data, "Login successful");
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return sendError(res, "Invalid credentials", 401);
      }
      if (error.message === "Please verify your email before logging in") {
        return sendError(res, error.message, 403);
      }
      console.error(error);
      return sendError(res, "Internal server error");
    }
  }

  refreshToken = async (req: AuthRequest, res: Response) => {
    const { token } = req.body;
    if (!token) return sendError(res, "Refresh token required", 400);

    const device = req.headers["user-agent"] || "Unknown Device";
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP") as string;

    try {
      const tokens = await this.authService.refreshToken(token, device, ip);
      return sendSuccess(res, tokens, "Token refreshed");
    } catch (error: any) {
      return sendError(res, error.message || "Invalid refresh token", 401);
    }
  }

  me = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.email) return sendError(res, "Unauthorized", 401);
      const user = await this.authService.me(req.user.email);
      if (!user) return sendError(res, "User not found", 404);
      return sendSuccess(res, user);
    } catch (error) {
      return sendError(res, "Internal server error");
    }
  }

  logout = async (req: AuthRequest, res: Response) => {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1] || "";
      const { refreshToken } = req.body;
      const result = await this.authService.logout(accessToken, refreshToken);
      return sendSuccess(res, null, result.message);
    } catch (error) {
      return sendError(res, "Internal server error");
    }
  }

  revokeAllSessions = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.userId) return sendError(res, "Unauthorized", 401);
      const result = await this.authService.revokeAllSessions(req.user.userId);
      return sendSuccess(res, null, result.message);
    } catch (error) {
      console.error(error);
      return sendError(res, "Internal server error");
    }
  }
}


