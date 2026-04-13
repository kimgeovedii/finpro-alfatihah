import { VoucherRepository } from "../repositories/voucher.repository";

export class VoucherService {
  private voucherRepository: VoucherRepository;

  constructor() {
    this.voucherRepository = new VoucherRepository();
  }

  public findAllVouchers = async (
    filters: any,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.voucherRepository.findAllVouchers(
      filters,
      skip,
      take,
    );

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  };

  public createVoucher = async (data: any) => {
    return this.voucherRepository.createVoucher(data);
  };

  public updateVoucher = async (id: string, data: any) => {
    return this.voucherRepository.updateVoucher(id, data);
  };

  public deleteVoucher = async (id: string) => {
    return this.voucherRepository.deleteVoucher(id);
  };
}
