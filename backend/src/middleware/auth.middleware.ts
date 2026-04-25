
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { isTokenBlacklisted } from "../features/auth/utils/tokenBlacklist";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Check if the token has been blacklisted (logout/revoked)
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ success: false, message: "Token has been revoked" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // No token just continue
  if (!authHeader) return next()

  const token = authHeader.split(" ")[1]
  // No token after split just continue
  if (!token) return next()

  try {
    // Check blacklist 
    if (await isTokenBlacklisted(token)) return next()

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded

    return next()
  } catch (error) {
    // Ignore invalid / expired token
    return next()
  }
};