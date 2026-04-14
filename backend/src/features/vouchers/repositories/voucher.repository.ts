import { prisma } from "../../../config/prisma";

export class VoucherRepository {
  public findAllVouchers = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.vouchers.findMany({
        where: filters,
        skip,
        take,
      }),
      prisma.vouchers.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public createVoucher = async (data: any) => {
    return prisma.vouchers.create({
      data,
    });
  };

  public updateVoucher = async (id: string, data: any) => {
    return prisma.vouchers.update({
      where: { id },
      data,
    });
  };

  public deleteVoucher = async (id: string) => {
    return prisma.vouchers.delete({
      where: { id },
    });
  };
}
