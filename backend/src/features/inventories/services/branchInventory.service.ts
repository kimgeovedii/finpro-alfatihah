import { BranchInventoryRepository } from "../repositories/branchInventory.repository";
import { prisma } from "../../../config/prisma";

export class BranchInventoryService {
  private branchInventoryRepository: BranchInventoryRepository;

  constructor() {
    this.branchInventoryRepository = new BranchInventoryRepository();
  }

  public findAllBranchInventories = async (
    query: any,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const filters: any = {};
    if (query.branchId) filters.branchId = query.branchId;
    if (query.productName) {
      filters.product = {
        productName: {
          contains: query.productName,
          mode: "insensitive",
        },
      };
    }

    const { data, total } =
      await this.branchInventoryRepository.findAllBranchInventories(
        filters,
        skip,
        take,
      );

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  };

  private async getEmployeeId(userId: string) {
    const employee = await prisma.employee.findUnique({ where: { userId } });
    if (!employee) throw new Error("Employee record not found for this user");
    return employee.id;
  }

  public createBranchInventory = async (data: any, userId: string) => {
    const employeeId = await this.getEmployeeId(userId);
    return this.branchInventoryRepository.createBranchInventory({ ...data, employeeId });
  };

  public updateBranchInventory = async (id: string, data: any, userId: string) => {
    const employeeId = await this.getEmployeeId(userId);
    return this.branchInventoryRepository.updateBranchInventory(id, { ...data, employeeId });
  };

  public deleteBranchInventory = async (id: string, userId: string) => {
    const employeeId = await this.getEmployeeId(userId);
    return this.branchInventoryRepository.deleteBranchInventory(id, employeeId);
  };
}
