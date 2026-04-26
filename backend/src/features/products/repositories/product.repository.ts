import { prisma } from "../../../config/prisma";

export class ProductRepository {
  public findAllProducts = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.products.findMany({
        where: filters,
        skip,
        take,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          productImages: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      }),
      prisma.products.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public getProductById = async (id: string) => {
    return prisma.products.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        productImages: {
          select: {
            id: true,
            imageUrl: true,
            isPrimary: true,
          },
        },
      },
    });
  };

  public getProductBySlug = async (
    slugName: string,
    userId: string | null,
    branchName: string
  ) => {
    const include: any = {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      productImages: {
        select: {
          id: true,
          imageUrl: true,
          isPrimary: true,
        },
      },
      branchInventories: {
        where: {
          branch: {
            storeName: branchName,
            schedules: {
              some: {},
            },
          },
        },
        select: {
          branchId: true,
          currentStock: true,
          branch: {
            select: {
              storeName: true,
              address: true,
              schedules: {
                select: {
                  startTime: true,
                  endTime: true,
                  dayName: true,
                },
              },
            },
          },
        },
      },
    };
  
    if (userId) {
      include.branchInventories.select.cartItems = {
        where: {
          cart: {
            userId,
            branch: {
              storeName: branchName,
            },
          },
        },
        select: {
          id: true, quantity: true,
          cart: {
            select: {
              branchId: true,
            },
          },
        },
      };
    }
  
    return prisma.products.findUnique({
      where: { slugName },
      include,
    });
  };

  public createProduct = async (data: any) => {
    return prisma.products.create({
      data,
    });
  };

  public updateProduct = async (id: string, data: any) => {
    return prisma.products.update({
      where: { id },
      data,
    });
  };

  public deleteProduct = async (id: string) => {
    return prisma.products.delete({
      where: { id },
    });
  };

  async findRandomProduct(branchId: string) {
    const where = {
      branchInventories: {
        some: { branchId: branchId },
      },
    };

    const count = await prisma.products.count({ where });
    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);

    return await prisma.products.findFirst({
      where,
      skip,
      select: { id: true },
    });
  }
}
