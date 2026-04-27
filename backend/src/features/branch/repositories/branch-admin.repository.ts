import { prisma } from "../../../config/prisma";
import { DayName, EmployeeRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export class BranchAdminRepository {
  async createEmployee(data: { fullName: string; email: string; role: EmployeeRole; branchId?: string; username?: string }) {
    const hashedPassword = await bcrypt.hash("Password123", 10);
    
    // 1. Create User
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username || data.email.split("@")[0],
        password: hashedPassword,
        role: "EMPLOYEE",
      }
    });

    // 2. Create Employee
    return prisma.employee.create({
      data: {
        fullName: data.fullName,
        role: data.role,
        branchId: data.branchId || null,
        userId: user.id,
      },
      include: {
        user: true,
        branch: {
          select: { storeName: true }
        }
      },
    });
  }

  async findAllEmployees(query: { search?: string; role?: EmployeeRole; branchId?: string }) {
    return prisma.employee.findMany({
      where: {
        ...(query.role && { role: query.role }),
        ...(query.branchId && { branchId: query.branchId }),
        ...(query.search && {
          OR: [
            { fullName: { contains: query.search, mode: "insensitive" } },
            { user: { email: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
      },
      include: {
        user: true,
        branch: {
          select: { storeName: true }
        }
      },
      orderBy: { fullName: "asc" },
    });
  }

  async findSchedulesByBranchId(branchId: string) {
    return prisma.branchSchedule.findMany({
      where: { branchId },
      orderBy: { dayName: "asc" },
    });
  }

  async createSchedule(branchId: string, data: { dayName: DayName; startTime: string; endTime: string }) {
    return prisma.branchSchedule.create({
      data: {
        ...data,
        branchId,
      },
    });
  }

  async updateSchedule(id: string, data: { dayName?: DayName; startTime?: string; endTime?: string }) {
    return prisma.branchSchedule.update({
      where: { id },
      data,
    });
  }

  async deleteSchedule(id: string) {
    return prisma.branchSchedule.delete({
      where: { id },
    });
  }

  async assignEmployee(branchId: string, employeeId: string) {
    return prisma.employee.update({
      where: { id: employeeId },
      data: { branchId },
    });
  }

  async findAvailableStoreAdmins(search?: string) {
    return prisma.employee.findMany({
      where: {
        role: "STORE_ADMIN",
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { username: { contains: search, mode: "insensitive" } } },
          ],
        }),
      },
      include: {
        user: true,
        branch: {
          select: { storeName: true }
        }
      },
    });
  }
}
