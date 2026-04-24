import { Prisma, ReferenceType, TransactionType } from "@prisma/client"
import { prisma } from "../../../config/prisma"

export class StockJournalRepository {
    async createStockJournal(productId: string, branchInventoryId: string, transactionType: TransactionType, quantityChange: number,
        stockBefore: number, stockAfter: number, referenceType: ReferenceType, orderId?: string, notes?: string) {
        const data: Prisma.stock_journalsUncheckedCreateInput = {
            productId, branchInventoryId, transactionType, quantityChange, stockBefore, stockAfter, referenceType,
            ...(orderId && { orderId }), ...(notes && { notes }), createdBy: null
        }

        return await prisma.stock_journals.create({ data })
    }
}