import { UserRole } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findRandomUser(role?: UserRole) {
    const where = role ? { role } : {}
  
    const count = await prisma.user.count({ where })
    if (count === 0) return null
  
    const skip = Math.floor(Math.random() * count)
  
    return prisma.user.findFirst({
      where,
      skip,
      select: { id: true, email: true },
    })
  }
}
