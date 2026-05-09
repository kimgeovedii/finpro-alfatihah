import { NextFunction, Request, Response } from "express";
import { MutationJournalService } from "../services/mutationJournal.service";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { sendSuccess } from "../../../utils/apiResponse";

export class MutationJournalController {
  private mutationJournalService: MutationJournalService;

  constructor() {
    this.mutationJournalService = new MutationJournalService();
  }

  public findAllMutations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const { data, meta } = await this.mutationJournalService.findAllMutations(
        filters,
        Number(page),
        Number(limit),
      );
      sendSuccess(res, { data, meta }, "Get all mutations successfully");
    } catch (error) {
      next(error);
    }
  };

  public findMutationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.mutationJournalService.findMutationById(
        req.params.id as string,
      );
      if (!data) return res.status(404).send({ message: "Mutation not found" });
      sendSuccess(res, data, "Get mutation successfully");
    } catch (error) {
      next(error);
    }
  };

  public createMutation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      if (!userId) throw new Error("User unauthorized");

      const data = await this.mutationJournalService.createMutation(
        req.body,
        userId,
      );
      sendSuccess(res, data, "Create mutation successfully");
    } catch (error) {
      next(error);
    }
  };

  public updateMutationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      if (!userId) throw new Error("User unauthorized");

      const { status, notes } = req.body;

      const data = await this.mutationJournalService.updateMutationStatus(
        req.params.id as string,
        status,
        userId,
        notes,
      );
      sendSuccess(res, data, "Update mutation status successfully");
    } catch (error) {
      next(error);
    }
  };
}
