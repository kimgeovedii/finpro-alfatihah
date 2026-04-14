import { StockJournalRepository } from "../repositories/stockJournal.repository";

export class StockJournalService {
  private stockJournalRepository: StockJournalRepository;

  constructor() {
    this.stockJournalRepository = new StockJournalRepository();
  }

  public findAllStockJournals = async (
    filters: any,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } =
      await this.stockJournalRepository.findAllStockJournals(
        filters,
        skip,
        take,
      );

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  };

  public findStockJournalById = async (id: string) => {
    return this.stockJournalRepository.findStockJournalById(id);
  }
}
