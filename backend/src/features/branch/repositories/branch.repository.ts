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

  async findAllActive() {
    return prisma.branch.findMany({
      where: { isActive: true },
      select: {
        id: true,
        storeName: true,
        address: true,
        city: true,
        province: true,
        latitude: true,
        longitude: true,
        maxDeliveryDistance: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findProductsByBranch(branchId: string, skip: number, take: number) {
    const where = { branchId };
    console.log(`Fetching products for branch: ${branchId}, skip: ${skip}, take: ${take}`);

    const [data, total] = await Promise.all([
      prisma.branch_inventories.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          currentStock: true,
          product: {
            select: {
              id: true,
              productName: true,
              slugName: true,
              basePrice: true,
              description: true,
              category: {
                select: { id: true, name: true }
              },
              productImages: {
                select: { id: true, imageUrl: true }
              }
            }
          }
        },
      }),
      prisma.branch_inventories.count({ where }),
    ]);

    // Map the result to match the product structure
    try {
      const products = data.map((inv) => {
        if (!inv.product) {
          console.warn(`Inventory record ${inv.id} has no linked product`);
          return null;
        }
        return {
          ...inv.product,
          currentStock: inv.currentStock,
        };
      }).filter(p => p !== null);

      return { data: products, total };
    } catch (err) {
      console.error("Error mapping products in BranchRepository:", err);
      throw err;
    }
  }
}
