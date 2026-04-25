import { prisma } from "../../../config/prisma";
import { UserRole, EmployeeRole, Prisma } from "@prisma/client";
import { CreateAccountDto, UpdateAccountDto } from "../validation/user.dto";

export class UserRepository {
  async findAllAccounts(params: {
    page: number;
    limit: number;
    search?: string;
    role?: EmployeeRole;
  }) {
    const { page, limit, search, role } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      // Only returning users that are employees for the Manage Accounts page
      employee: {
        isNot: null,
      },
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { employee: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (role) {
      where.employee = {
        role: role,
      };
    }

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          employee: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findRandomUser(role: UserRole) {
    const users = await prisma.user.findMany({
      where: { role },
    });
    if (users.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async createEmployeeAccount(data: CreateAccountDto, hashedPassword?: string) {
    return prisma.$transaction(async (tx) => {
      // Create User
      const user = await tx.user.create({
        data: {
          email: data.email,
          username: data.username || data.email.split("@")[0],
          password: hashedPassword,
          role: UserRole.EMPLOYEE,
          emailVerifiedAt: new Date(), // Auto verify since created by Super Admin
        },
      });

      // Create Employee profile
      const employee = await tx.employee.create({
        data: {
          fullName: data.fullName,
          role: data.role,
          branchId: data.branchId,
          userId: user.id,
        },
        include: {
          branch: true,
        },
      });

      // Return combined data similar to findMany
      return {
        ...user,
        employee,
      };
    });
  }

  async updateEmployeeAccount(userId: string, data: UpdateAccountDto) {
    return prisma.$transaction(async (tx) => {
      // Update User if needed
      if (data.email || data.username) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...(data.email && { email: data.email }),
            ...(data.username && { username: data.username }),
          },
        });
      }

      // Update Employee profile if needed
      let employee;
      if (data.fullName || data.role || data.branchId) {
        employee = await tx.employee.update({
          where: { userId },
          data: {
            ...(data.fullName && { fullName: data.fullName }),
            ...(data.role && { role: data.role }),
            ...(data.branchId && { branchId: data.branchId }),
          },
          include: {
            branch: true,
          },
        });
      }

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        include: {
          employee: {
            include: {
              branch: true,
            },
          },
        },
      });

      return updatedUser;
    });
  }

  async deleteAccount(userId: string) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { userId } });
      if (employee) {
        await tx.employee.delete({ where: { id: employee.id } });
      }

      return tx.user.delete({
        where: { id: userId },
      });
    });
  }

  async findAccountById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
      },
    });
  }

  // Profile Management methods
  async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });
  }

  async updateProfile(userId: string, data: { username?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  async updateEmail(userId: string, newEmail: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailVerifiedAt: null, // Reset verification status
      },
    });
  }
}
