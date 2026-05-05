import { prisma } from "../../../config/prisma";

export class BranchInventoryRepository {
  public findAllBranchInventories = async (
    filters: any,
    skip: number,
    take: number,
    orderBy?: any,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.branch_inventories.findMany({
        where: filters,
        skip,
        take,
        orderBy: orderBy && orderBy.length > 0 ? orderBy : [{ updatedAt: "desc" }],
        include: {
          product: {
            select: {
              productName: true,
              sku: true,
              productImages: {
                select: {
                  imageUrl: true,
                },
                take: 1,
              },
            },
          },
          branch: {
            select: {
              storeName: true,
              city: true,
            },
          },
        },
      }),
      prisma.branch_inventories.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public findBranchInventoryById = async (id: string) => {
    return await prisma.branch_inventories.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            productName: true,
            sku: true,
          },
        },
        branch: {
          select: {
            storeName: true,
          },
        },
      },
    });
  };

  public updateBranchInventory = async (id: string, currentStock: number) => {
    return await prisma.branch_inventories.update({
      where: { id },
      data: { currentStock },
    });
  };

  public deleteBranchInventory = async (id: string) => {
    return await prisma.branch_inventories.delete({
      where: { id },
    });
  };

  public createBranchInventory = async (data: {
    branchId: string;
    productId: string;
    currentStock: number;
  }) => {
    return await prisma.branch_inventories.create({
      data,
    });
  };

  public findBranchInventoryByProductAndBranch = async (
    productId: string,
    branchId: string,
  ) => {
    return await prisma.branch_inventories.findFirst({
      where: {
        productId,
        branchId,
      },
    });
  };
}
