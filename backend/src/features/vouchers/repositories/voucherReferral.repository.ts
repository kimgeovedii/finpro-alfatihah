import { prisma } from "../../../config/prisma";

export class VoucherReferralRepository {
  public createVoucherReferral = async (data: any) => {
    return prisma.voucher_referral.create({
      data,
    });
  };
}
