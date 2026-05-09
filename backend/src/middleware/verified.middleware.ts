import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/apiResponse";

/**
 * Middleware to restrict access to only verified users.
 * Must be placed AFTER authMiddleware.
 */
export const verifiedMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  // Check if emailVerifiedAt exists in the user object
  // Note: authMiddleware needs to ensure this info is available or we fetch it
  if (!req.user.emailVerifiedAt) {
    return sendError(res, "Silakan verifikasi email Anda terlebih dahulu untuk menggunakan fitur ini.", 403);
  }

  next();
};
