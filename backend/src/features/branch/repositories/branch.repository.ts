import { prisma } from "../../../config/prisma";

export class BranchRepository {
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit, search, sortBy = "createdAt", sortOrder = "desc" } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { province: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          employees: {
            include: { user: true },
          },
          schedules: true,
        },
      }),
      prisma.branch.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return prisma.branch.findUnique({
      where: { id },
      include: {
        schedules: true,
        employees: {
          include: { user: true },
        },
      },
    });
  }

  async create(data: any) {
    return prisma.branch.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.branch.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findRandomBranch() {
    const count = await prisma.branch.count({ where: { isActive: true } });
    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);

    return await prisma.branch.findFirst({
      where: { isActive: true },
      skip,
      select: { id: true },
    });
  }
}
