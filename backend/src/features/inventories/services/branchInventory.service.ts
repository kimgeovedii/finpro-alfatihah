import { BranchInventoryRepository } from "../repositories/branchInventory.repository";
import { prisma } from "../../../config/prisma";
import { EmployeeRole, TransactionType, ReferenceType } from "@prisma/client";

export class BranchInventoryService {
  private branchInventoryRepository: BranchInventoryRepository;

  constructor() {
    this.branchInventoryRepository = new BranchInventoryRepository();
  }

  public findAllBranchInventories = async (
    query: any,
    page: number,
    limit: number,
    user?: any,
  ) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const filters: any = {};
    const stockStatus = query.stockStatus?.toString().trim();
    const branchId = query.branchId?.toString().trim();

    if (user?.employee?.role === EmployeeRole.STORE_ADMIN) {
      filters.branchId = user.employee.branchId;
    } else if (branchId && branchId !== "all") {
      filters.branchId = branchId;
    }

    if (query.productName) {
      filters.product = {
        productName: {
          contains: query.productName.toString().trim(),
          mode: "insensitive",
        },
      };
    }

    if (stockStatus && stockStatus !== "all") {
      if (stockStatus === "out_of_stock") {
        filters.currentStock = 0;
      } else if (stockStatus === "low_stock") {
        filters.currentStock = { gt: 0, lte: 100 };
      } else if (stockStatus === "in_stock") {
        filters.currentStock = { gt: 100 };
      }
    }

    const { sortBy, sortOrder } = query;
    let orderBy: any[] = [{ updatedAt: "desc" }];

    if (sortBy && sortOrder) {
      if (sortBy === "productName") {
        orderBy = [{ product: { productName: sortOrder } }];
      } else if (sortBy === "branch") {
        orderBy = [{ branch: { storeName: sortOrder } }];
      } else {
        orderBy = [{ [sortBy]: sortOrder }];
      }
    }

    const { data, total } =
      await this.branchInventoryRepository.findAllBranchInventories(
        filters,
        skip,
        take,
        orderBy,
      );

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  };

  public createBranchInventory = async (data: any, user: any) => {
    if (user.employee.role === EmployeeRole.STORE_ADMIN) {
      if (data.branchId !== user.employee.branchId) {
        throw new Error(
          "Forbidden: You can only create inventory for your assigned branch",
        );
      }
    }

    const { branchId, productId, currentStock, actualStock, notes } = data;
    const initialStock = currentStock || actualStock || 0;

    return await prisma.$transaction(async (tx) => {
      // 1. Create inventory
      const inventory = await tx.branch_inventories.create({
        data: {
          branchId,
          productId,
          currentStock: initialStock,
        },
      });

      // 2. Create initial journal entry
      await tx.stock_journals.create({
        data: {
          branchInventoryId: inventory.id,
          productId,
          transactionType: TransactionType.IN,
          quantityChange: initialStock,
          stockBefore: 0,
          stockAfter: initialStock,
          referenceType: ReferenceType.MANUAL,
          notes: notes || "Initial stock entry",
          createdBy: user.employee.id,
        },
      });

      return inventory;
    });
  };

  public updateBranchInventory = async (id: string, data: any, user: any) => {
    const { actualStock, notes } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. Get current inventory state
      const inventory = await tx.branch_inventories.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new Error("Inventory record not found");
      }

      // Role-based check
      if (user.employee.role === EmployeeRole.STORE_ADMIN) {
        if (inventory.branchId !== user.employee.branchId) {
          throw new Error(
            "Forbidden: You can only update inventory for your assigned branch",
          );
        }
      }

      const stockBefore = inventory.currentStock;
      const stockAfter = actualStock;
      const quantityChange = stockAfter - stockBefore;

      if (quantityChange === 0) return inventory;

      // 2. Update inventory
      const updatedInventory = await tx.branch_inventories.update({
        where: { id },
        data: { currentStock: stockAfter },
      });

      // 3. Create journal entry
      await tx.stock_journals.create({
        data: {
          branchInventoryId: id,
          productId: inventory.productId,
          transactionType:
            quantityChange > 0 ? TransactionType.IN : TransactionType.OUT,
          quantityChange: Math.abs(quantityChange),
          stockBefore,
          stockAfter,
          referenceType: ReferenceType.MANUAL,
          notes: notes || "Manual stock adjustment",
          createdBy: user.employee.id,
        },
      });

      return updatedInventory;
    });
  };

  public deleteBranchInventory = async (id: string, user: any) => {
    if (user.employee.role === EmployeeRole.STORE_ADMIN) {
      const inventory = await prisma.branch_inventories.findUnique({
        where: { id },
      });
      if (!inventory || inventory.branchId !== user.employee.branchId) {
        throw new Error(
          "Forbidden: You can only delete inventory for your assigned branch",
        );
      }
    }
    return this.branchInventoryRepository.deleteBranchInventory(id);
  };
}
