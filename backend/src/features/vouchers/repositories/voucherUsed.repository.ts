import { prisma } from "../../../config/prisma";

export class VoucherUsedRepository {
  public useVoucher = async (data: any) => {
    return prisma.voucher_useds.create({
      data,
    });
  };
}
