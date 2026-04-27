import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../../../config";

export function generateTokens(user: any, sessionId: string, rememberMe: boolean = false) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt, sessionId },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshTokenExpiry = rememberMe ? "30d" : "1d";

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, sessionId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
}
