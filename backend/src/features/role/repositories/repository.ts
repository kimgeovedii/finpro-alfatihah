import { prisma } from "../../../config/prisma";

export class RoleRepository {
  async findAll() {
    return prisma.role.findMany({ include: { users: true } });
  }

  async findById(id: string) {
    return prisma.role.findUnique({ where: { id }, include: { users: true } });
  }

  async findByName(name: string) {
    return prisma.role.findUnique({ where: { name } });
  }

  async create(data: { name: string }) {
    return prisma.role.create({ data });
  }

  async update(id: string, data: { name: string }) {
    return prisma.role.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.role.delete({ where: { id } });
  }
}
