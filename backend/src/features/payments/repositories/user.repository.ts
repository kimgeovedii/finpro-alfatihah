import { prisma } from "../../../config/prisma";

export class UserRepository {
    findById = async (id: string) => prisma.user.findFirst({ where: { id } })
}