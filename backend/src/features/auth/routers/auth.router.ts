import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../service/auth.service";
import { AuthRepository } from "../repositories/auth.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { loginRateLimiter } from "../../../middleware/rate-limiter.middleware";
import rateLimit from "express-rate-limit";
import { CartRepository } from "../repositories/cart.repository";

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

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registration attempts per hour
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after an hour.",
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
    const cartRepository = new CartRepository();
    const authService = new AuthService(authRepository, cartRepository);
    this.authController = new AuthController(authService);

    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post("/register", registerLimiter, this.authController.register);
    this.router.post("/verify-set-password", this.authController.verifyAndSetPassword);
    this.router.post("/google", this.authController.googleLogin);
    
    this.router.post(
      "/resend-verification",
      verificationRateLimiter,
      this.authController.resendVerification,
    );
    
    this.router.post("/login", loginRateLimiter, this.authController.login);
    this.router.post("/refresh", refreshRateLimiter, this.authController.refreshToken);
    
    // Reset Password
    this.router.post("/reset-password", verificationRateLimiter, this.authController.requestResetPassword);
    this.router.post("/confirm-reset-password", this.authController.confirmResetPassword);

    // Protected routes
    this.router.post("/logout", authMiddleware, this.authController.logout);
    this.router.get("/me", authMiddleware, this.authController.me);
    this.router.post(
      "/revoke-all",
      authMiddleware,
      this.authController.revokeAllSessions,
    );
  }
}

export default new AuthRouter().router;
