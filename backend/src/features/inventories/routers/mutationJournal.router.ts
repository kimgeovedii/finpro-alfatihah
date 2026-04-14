import { Router } from "express";
import { MutationJournalController } from "../controllers/mutationJournal.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate";
import { createMutationSchema, updateMutationStatusSchema } from "../validations/mutationJournal.schema";

export class MutationJournalRouter {
  private router: Router;
  private mutationJournalController: MutationJournalController;

  constructor() {
    this.router = Router();
    this.mutationJournalController = new MutationJournalController();
    this.routes();
  }

  private routes() {
    this.router.get("/", authMiddleware, this.mutationJournalController.findAllMutations);
    this.router.get("/:id", authMiddleware, this.mutationJournalController.findMutationById);
    this.router.post("/", authMiddleware, validate(createMutationSchema), this.mutationJournalController.createMutation);
    this.router.patch("/:id/status", authMiddleware, validate(updateMutationStatusSchema), this.mutationJournalController.updateMutationStatus);
  }

  public getRouter(): Router {
    return this.router;
  }
}
