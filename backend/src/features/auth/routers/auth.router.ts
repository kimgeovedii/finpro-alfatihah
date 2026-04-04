import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../service/auth.service";
import { AuthRepository } from "../repositories/auth.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { loginRateLimiter } from "../../../middleware/rate-limiter.middleware";
import rateLimit from "express-rate-limit";

const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many refresh attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verificationRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 1, 
  message: {
    success: false,
    message: "Please wait 60 seconds before sending another verification email.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();

    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);
    this.authController = new AuthController(authService);

    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post("/register", this.authController.register);
    this.router.get("/verify-email", this.authController.verifyEmail);
    this.router.post("/resend-verification", verificationRateLimiter, this.authController.resendVerification);
    this.router.post("/login", this.authController.login);
    this.router.post("/refresh", this.authController.refreshToken);
    this.router.post("/logout", authMiddleware, this.authController.logout);
    this.router.get("/me", authMiddleware, this.authController.me);
    this.router.post("/revoke-all", authMiddleware, this.authController.revokeAllSessions);
  }
}

export default new AuthRouter().router;
