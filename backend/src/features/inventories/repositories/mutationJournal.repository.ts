import { prisma } from "../../../config/prisma";
import { MutationStatus, TransactionType, ReferenceType } from "@prisma/client";

export class MutationJournalRepository {
  public findAllMutations = async (
    filters: any,
    skip?: number,
    take?: number,
  ) => {
    const [data, total] = await prisma.$transaction([
      prisma.mutation_journals.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { productName: true } },
          employee: { select: { fullName: true } },
          sourceBranch: { select: { storeName: true } },
          destionationBranch: { select: { storeName: true } },
        },
      }),
      prisma.mutation_journals.count({ where: filters }),
    ]);

    return { data, total };
  };

  public findMutationById = async (id: string) => {
    return prisma.mutation_journals.findUnique({
      where: { id },
      include: {
        product: true,
        employee: true,
        sourceBranch: true,
        destionationBranch: true,
      },
    });
  };

  public createMutation = async (data: {
    productId: string;
    quantity: number;
    sourceBranchId: string;
    destinationBranchId: string;
    notes?: string;
    employeeId: string;
  }) => {
    return prisma.mutation_journals.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        status: MutationStatus.PENDING,
        sourceBranchId: data.sourceBranchId,
        destinationBranchId: data.destinationBranchId,
        notes: data.notes,
        createdBy: data.employeeId,
        updatedAt: new Date(),
      },
    });
  };

  public updateMutationStatus = async (
    id: string,
    status: MutationStatus,
    employeeId: string,
    notes?: string,
  ) => {
    return prisma.$transaction(async (tx) => {
      const mutation = await tx.mutation_journals.findUnique({
        where: { id },
      });

      if (!mutation) throw new Error("Mutation not found");

      if (
        mutation.status === MutationStatus.CANCELLED ||
        mutation.status === MutationStatus.RECEIVED
      ) {
        throw new Error(
          "Cannot change status of completed or cancelled mutation",
        );
      }

      const updatedMutation = await tx.mutation_journals.update({
        where: { id },
        data: {
          status,
          notes: notes
            ? `${mutation.notes ? mutation.notes + "\n" : ""}${notes}`
            : mutation.notes,
          updatedAt: new Date(),
        },
      });

      if (status === MutationStatus.SHIPPED) {
        const sourceInventory = await tx.branch_inventories.findFirst({
          where: {
            branchId: mutation.sourceBranchId,
            productId: mutation.productId,
          },
        });

        if (
          !sourceInventory ||
          sourceInventory.currentStock < mutation.quantity
        ) {
          throw new Error(
            "Insufficient stock in source branch to ship mutation",
          );
        }

        const newStock = sourceInventory.currentStock - mutation.quantity;

        await tx.branch_inventories.update({
          where: { id: sourceInventory.id },
          data: { currentStock: newStock },
        });

        await tx.stock_journals.create({
          data: {
            branchInventoryId: sourceInventory.id,
            productId: mutation.productId,
            transactionType: TransactionType.OUT,
            quantityChange: mutation.quantity,
            stockBefore: sourceInventory.currentStock,
            stockAfter: newStock,
            referenceType: ReferenceType.MUTATION,
            mutationId: mutation.id,
            notes: `Mutation Shipped to branch ${mutation.destinationBranchId}`,
            createdBy: employeeId,
          },
        });
      }

      if (status === MutationStatus.RECEIVED) {
        let destinationInventory = await tx.branch_inventories.findFirst({
          where: {
            branchId: mutation.destinationBranchId,
            productId: mutation.productId,
          },
        });

        let stockBefore = 0;

        if (!destinationInventory) {
          destinationInventory = await tx.branch_inventories.create({
            data: {
              branchId: mutation.destinationBranchId,
              productId: mutation.productId,
              currentStock: mutation.quantity,
            },
          });
        } else {
          stockBefore = destinationInventory.currentStock;
          await tx.branch_inventories.update({
            where: { id: destinationInventory.id },
            data: { currentStock: stockBefore + mutation.quantity },
          });
        }

        await tx.stock_journals.create({
          data: {
            branchInventoryId: destinationInventory.id,
            productId: mutation.productId,
            transactionType: TransactionType.IN,
            quantityChange: mutation.quantity,
            stockBefore: stockBefore,
            stockAfter: stockBefore + mutation.quantity,
            referenceType: ReferenceType.MUTATION,
            mutationId: mutation.id,
            notes: `Mutation Received from branch ${mutation.sourceBranchId}`,
            createdBy: employeeId,
          },
        });
      }

      if (
        status === MutationStatus.CANCELLED &&
        mutation.status === MutationStatus.SHIPPED
      ) {
        const sourceInventory = await tx.branch_inventories.findFirst({
          where: {
            branchId: mutation.sourceBranchId,
            productId: mutation.productId,
          },
        });
        if (sourceInventory) {
          const newStock = sourceInventory.currentStock + mutation.quantity;
          await tx.branch_inventories.update({
            where: { id: sourceInventory.id },
            data: { currentStock: newStock },
          });

          await tx.stock_journals.create({
            data: {
              branchInventoryId: sourceInventory.id,
              productId: mutation.productId,
              transactionType: TransactionType.IN,
              quantityChange: mutation.quantity,
              stockBefore: sourceInventory.currentStock,
              stockAfter: newStock,
              referenceType: ReferenceType.MUTATION,
              mutationId: mutation.id,
              notes: "Mutation Cancelled, stock returned",
              createdBy: employeeId,
            },
          });
        }
      }

      return updatedMutation;
    });
  };
}
