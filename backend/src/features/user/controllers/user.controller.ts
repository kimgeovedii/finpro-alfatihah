import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../../../utils/apiResponse";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return sendSuccess(res, users, "Users retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message || "Failed to retrieve users", 500);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const user = await this.userService.getUserById(id);
      return sendSuccess(res, user, "User retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message || "Failed to retrieve user", error.message === "User not found" ? 404 : 500);
    }
  };
}
