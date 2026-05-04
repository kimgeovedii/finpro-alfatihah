import { prisma } from "../../../config/prisma";

export class ProductRepository {
  public findAllProducts = async (
    filters: any,
    skip?: number,
    take?: number,
    orderBy: string = "createdAt",
    orderDir: "asc" | "desc" = "desc",
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.products.findMany({
        where: filters,
        skip,
        take,
        orderBy: {
          [orderBy]: orderDir,
        },
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
    return prisma.products.findFirst({
      where: { id, deletedAt: null },
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
  
    return prisma.products.findFirst({
      where: { slugName, deletedAt: null },
      include,
    });
  };

  public createProduct = async (data: any) => {
    const { imageUrls, ...productData } = data;
    return prisma.products.create({
      data: {
        ...productData,
        productImages:
          imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0
            ? {
                create: imageUrls.map((imageUrl, index) => ({
                  imageUrl,
                  isPrimary: index === 0,
                })),
              }
            : undefined,
      },
    });
  };


  public updateProduct = async (
    id: string,
    data: any,
    existingImageIds: string[] = [],
  ) => {
    const { imageUrls, ...updateData } = data;
    const shouldDeleteOldImages = existingImageIds.length > 0 || (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0);

    if (shouldDeleteOldImages) {
      const productImageUpdate: any = {
        deleteMany: existingImageIds.length > 0 ? { id: { notIn: existingImageIds } } : {},
      };

      if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
        const startPrimaryIndex = existingImageIds.length === 0 ? 0 : 1;
        productImageUpdate.create = imageUrls.map((imageUrl: string, index: number) => ({
          imageUrl,
          isPrimary: existingImageIds.length === 0 && index === 0,
        }));
      }

      return prisma.products.update({
        where: { id },
        data: {
          ...updateData,
          productImages: productImageUpdate,
        },
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
      });
    }

    return prisma.products.update({
      where: { id },
      data: updateData,
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
    });
  };

  public deleteProduct = async (id: string) => {
    return prisma.products.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  };

  async findRandomProduct(branchId: string) {
    const where = {
      branchInventories: {
        some: { branchId: branchId },
      },
      deletedAt: null,
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
