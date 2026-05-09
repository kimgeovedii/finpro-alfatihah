import { prisma } from "../../../config/prisma";

export class StockJournalRepository {
  public findAllStockJournals = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.stock_journals.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          branchInventory: {
            select: {
              branch: {
                select: {
                  storeName: true,
                },
              },
              product: {
                select: { productName: true, basePrice: true },
              },
            },
          },
          employee: {
            select: { fullName: true },
          },
        },
      }),
      prisma.stock_journals.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public findStockJournalById = async (id: string) => {
    return prisma.stock_journals.findUnique({
      where: { id },
      include: {
        product: true,
        employee: true,
        order: true,
        mutation: true,
      },
    });
  };
}
