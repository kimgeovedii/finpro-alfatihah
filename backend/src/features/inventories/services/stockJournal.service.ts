import { StockJournalRepository } from "../repositories/stockJournal.repository";
import { EmployeeRole } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class StockJournalService {
  private stockJournalRepository: StockJournalRepository;

  constructor() {
    this.stockJournalRepository = new StockJournalRepository();
  }

  public findAllStockJournals = async (
    filters: any,
    page: number,
    limit: number,
    user?: any,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const finalFilters = { ...filters };

    if (user?.employee?.role === EmployeeRole.STORE_ADMIN) {
      finalFilters.branchInventory = {
        branchId: user.employee.branchId,
      };
    }

    const { data, total } =
      await this.stockJournalRepository.findAllStockJournals(
        finalFilters,
        skip,
        take,
      );

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  };

  public findStockJournalById = async (id: string, user?: any) => {
    const journal = await this.stockJournalRepository.findStockJournalById(id);
    if (!journal) return null;

    // Role-based check
    if (user?.employee?.role === EmployeeRole.STORE_ADMIN) {
      const inventory = await prisma.branch_inventories.findUnique({
        where: { id: journal.branchInventoryId },
      });
      if (!inventory || inventory.branchId !== user.employee.branchId) {
        throw new Error("Forbidden: You do not have access to this journal");
      }
    }

    return journal;
  };
}
