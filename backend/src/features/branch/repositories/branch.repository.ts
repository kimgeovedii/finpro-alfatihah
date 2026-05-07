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
        isDefault: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findAllActivePaginated(skip: number, take: number) {
    const where = { isActive: true };
    const [data, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          storeName: true,
          address: true,
          city: true,
          province: true,
          latitude: true,
          longitude: true,
          maxDeliveryDistance: true,
          isDefault: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.branch.count({ where }),
    ]);
    return { data, total };
  }

  async findProductsByBranch(branchId: string, skip: number, take: number) {
    const where = { branchId: branchId.trim() };
    console.log(`[BranchRepository] Fetching products for branch: "${branchId}", skip: ${skip}, take: ${take}`);

    const [data, total] = await Promise.all([
      prisma.branch_inventories.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          currentStock: true,
          branch: {
            select: { id: true, storeName: true, city: true }
          },
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

    console.log(`[BranchRepository] Found ${data.length} inventory records, total count: ${total}`);

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
          branchName: inv.branch?.storeName,
          branchId: inv.branch?.id,
          branchCity: inv.branch?.city,
        };
      }).filter(p => p !== null);

      return { data: products, total };
    } catch (err) {
      console.error("Error mapping products in BranchRepository:", err);
      throw err;
    }
  }

  async resetAllDefaults() {
    return prisma.branch.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
  }

  async setDefault(id: string) {
    return prisma.branch.update({
      where: { id },
      data: { isDefault: true },
      include: {
        schedules: true,
        employees: {
          include: { user: true },
        },
      },
    });
  }
}
