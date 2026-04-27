import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import { SessionService } from "../service/session.service";
import { SessionRepository } from "../repositories/session.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = Router();
const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository);
const sessionController = new SessionController(sessionService);

router.get("/active", authMiddleware, sessionController.getActiveSessions);
router.delete("/:sessionId", authMiddleware, sessionController.revokeSession);

export default router;
