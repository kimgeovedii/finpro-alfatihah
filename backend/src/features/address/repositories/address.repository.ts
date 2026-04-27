import { prisma } from "../../../config/prisma";
import { Prisma } from "@prisma/client";

export class AddressRepository {
  async create(data: Prisma.AddressUncheckedCreateInput) {
    return prisma.address.create({ data });
  }

  async findManyByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.AddressUncheckedUpdateInput) {
    return prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.address.delete({
      where: { id },
    });
  }

  async unsetPrimary(userId: string) {
    return prisma.address.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  async setPrimary(id: string) {
    return prisma.address.update({
      where: { id },
      data: { isPrimary: true },
    });
  }

  async countByUserId(userId: string) {
    return prisma.address.count({
      where: { userId },
    });
  }
}
