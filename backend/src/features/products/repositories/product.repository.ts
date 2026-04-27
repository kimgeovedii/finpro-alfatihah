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

  public getProductBySlug = async (slugName: string) => {
    return prisma.products.findUnique({
      where: { slugName },
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


  public updateProduct = async (id: string, data: any) => {
    const { imageUrls, ...updateData } = data;

    // If imageUrls are provided, delete old images and create new ones
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      return prisma.products.update({
        where: { id },
        data: {
          ...updateData,
          productImages: {
            deleteMany: {},
            create: imageUrls.map((imageUrl, index) => ({
              imageUrl,
              isPrimary: index === 0,
            })),
          },
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
