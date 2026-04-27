import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/apiResponse";
import { prisma } from "../config/prisma";
import { EmployeeRole } from "@prisma/client";

async function getEmployeeByUserId(userId: string) {
  return await prisma.employee.findUnique({
    where: { userId },
  });
}

function checkPermissions(role: EmployeeRole, allowedRoles: EmployeeRole[]) {
  return allowedRoles.includes(role) || role === EmployeeRole.SUPER_ADMIN;
}

async function authorizeEmployee(req: AuthRequest, res: Response, allowedRoles: EmployeeRole[]) {
  if (!req.user?.userId) return sendError(res, "Unauthorized", 401);
  const emp = await getEmployeeByUserId(req.user.userId);
  if (!emp) return sendError(res, "Forbidden: Employee access required", 403);
  if (!checkPermissions(emp.role, allowedRoles)) {
    return sendError(res, "Forbidden: Insufficient permissions", 403);
  }
  req.user.employee = emp;
  return true;
}

export const roleMiddleware = (allowedRoles: EmployeeRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (await authorizeEmployee(req, res, allowedRoles)) next();
    } catch (error) {
      return sendError(res, "Internal Server Error", 500);
    }
  };
};
