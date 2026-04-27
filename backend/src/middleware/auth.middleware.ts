
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
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Check if the token or sessionId has been blacklisted (logout/revoked)
    if (await isTokenBlacklisted(token) || (decoded.sessionId && await isTokenBlacklisted(decoded.sessionId))) {
      return res.status(401).json({ success: false, message: "Token has been revoked" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

