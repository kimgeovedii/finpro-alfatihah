import { prisma } from "../../../config/prisma";
import { TransactionType, ReferenceType } from "@prisma/client";

export class BranchInventoryRepository {
  public findAllBranchInventories = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.branch_inventories.findMany({
        where: filters,
        skip,
        take,
        include: {
          product: {
            select: {
              productName: true,
              sku: true,
            },
          },
          branch: {
            select: {
              storeName: true,
              city: true,
            },
          },
        },
      }),
      prisma.branch_inventories.count({
        where: filters,
      }),
    ]);

    return { data, total };
  };

  public createBranchInventory = async (data: {
    branchId: string;
    productId: string;
    currentStock: number;
    notes?: string;
    employeeId: string;
    referenceType?: ReferenceType;
    orderId?: string;
    mutationId?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      const inventory = await tx.branch_inventories.create({
        data: {
          branchId: data.branchId,
          productId: data.productId,
          currentStock: data.currentStock,
        },
      });

      await tx.stock_journals.create({
        data: {
          branchInventoryId: inventory.id,
          productId: data.productId,
          transactionType: TransactionType.IN,
          quantityChange: data.currentStock,
          stockBefore: 0,
          stockAfter: data.currentStock,
          referenceType: data.referenceType || ReferenceType.MANUAL,
          orderId: data.orderId,
          mutationId: data.mutationId,
          notes: data.notes || "Initial stock entry",
          createdBy: data.employeeId,
        },
      });

      return inventory;
    });
  };

  public updateBranchInventory = async (
    id: string,
    data: {
      actualStock: number;
      notes?: string;
      employeeId: string;
      referenceType?: ReferenceType;
      orderId?: string;
      mutationId?: string;
    },
  ) => {
    return prisma.$transaction(async (tx) => {
      const currentInventory = await tx.branch_inventories.findUnique({
        where: { id },
      });

      if (!currentInventory) {
        throw new Error("Inventory not found");
      }

      const difference = data.actualStock - currentInventory.currentStock;

      if (difference === 0) {
        return currentInventory;
      }

      const transactionType =
        difference > 0 ? TransactionType.IN : TransactionType.OUT;

      const updatedInventory = await tx.branch_inventories.update({
        where: { id },
        data: {
          currentStock: data.actualStock,
        },
      });

      await tx.stock_journals.create({
        data: {
          branchInventoryId: updatedInventory.id,
          productId: updatedInventory.productId,
          transactionType,
          quantityChange: Math.abs(difference),
          stockBefore: currentInventory.currentStock,
          stockAfter: data.actualStock,
          referenceType: data.referenceType || ReferenceType.MANUAL,
          orderId: data.orderId,
          mutationId: data.mutationId,
          notes: data.notes,
          createdBy: data.employeeId,
        },
      });

      return updatedInventory;
    });
  };

  public deleteBranchInventory = async (id: string, employeeId: string) => {
    return prisma.$transaction(async (tx) => {
      const currentInventory = await tx.branch_inventories.findUnique({
        where: { id },
      });

      if (!currentInventory) {
        throw new Error("Inventory not found");
      }

      if (currentInventory.currentStock > 0) {
        await tx.stock_journals.create({
          data: {
            branchInventoryId: currentInventory.id,
            productId: currentInventory.productId,
            transactionType: TransactionType.OUT,
            quantityChange: currentInventory.currentStock,
            stockBefore: currentInventory.currentStock,
            stockAfter: 0,
            referenceType: ReferenceType.MANUAL,
            notes: "Inventory deleted",
            createdBy: employeeId,
          },
        });
      }

      return tx.branch_inventories.delete({
        where: { id },
      });
    });
  };
}
