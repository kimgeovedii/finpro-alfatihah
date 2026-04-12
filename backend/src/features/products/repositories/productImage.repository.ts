import { prisma } from "../../../config/prisma";

export class ProductImageRepository {
  public getImages = async () => {
    const data = await prisma.product_images.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
          },
        },
      },
    });
    return data;
  };

  public getImageById = async (id: string) => {
    return await prisma.product_images.findUnique({
      where: {
        id,
      },
      include: {
        product: {
          select: {
            id: true,
          },
        },
      },
    });
  };

  public createImage = async (data: any) => {
    return await prisma.product_images.create({
      data,
    });
  };

  public updateImage = async (id: string, data: any) => {
    return await prisma.product_images.update({
      where: {
        id,
      },
      data,
    });
  };

  public deleteImage = async (id: string) => {
    return await prisma.product_images.delete({
      where: {
        id,
      },
    });
  };
}
